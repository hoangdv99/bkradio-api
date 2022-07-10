import fs from "fs";
import PDF from "pdf-parse/lib/pdf-parse";
import axios from "axios";
import got from 'got'
import { storage } from '../../../storage'
import getVoice from '../../voices/_id/get'
import createNewAudio from '../post'
import { execute } from '../../../utils'
import kue from 'kue'
import nodemailer from 'nodemailer'
import slugify from 'slugify'

const queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    // auth: process.env.REDIS_PASSWORD,
  }
})

export default async (req, res) => {
  const { buffer, originalname } = req.files[0];
  const originalName = originalname.split('.')[0]
  const content = await PDF(buffer);
  const chunks = splitString(5000, content.text);
  const { voiceId } = req.body
  const { email } = req.user
  req.body.topicIds = req.body.topicIds.split(',')

  const result = await execute(getVoice, { params: { id: voiceId } })
  const { ttsValue } = result.res

  queue.create('convert-queue', {
    chunks,
    originalName,
    ttsValue,
    audio: req.body,
    email
  }).save()

  return res.sendStatus(200)
}

queue.process('convert-queue', (job, done) => {
  const { chunks, originalName, ttsValue, audio, email } = job.data
  convert(chunks, originalName, ttsValue, audio, email, done)
})

const convert = async (chunks, originalName, ttsValue, audio, email, done) => {
  try {
    const convertedLinks = []
    for (let i = 0; i < chunks.length; i++) {
      const convertedLink = await convertTextToAudio(chunks[i], ttsValue)
      convertedLinks.push(convertedLink)
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    for (let i = 0; i < convertedLinks.length; i++) {
      await downloadConvertedAudio(originalName, convertedLinks[i])
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    const dir = `./downloads/${originalName}`
    const files = fs.readdirSync(dir)
    const writeStream = fs.createWriteStream(`${dir}/${originalName}-final.mp3`)
    await recursiveStreamWriter(files, originalName, writeStream, audio, email)
    done()
  } catch (err) {
    console.log(err)
  }
}

const recursiveStreamWriter = async (files, originalName, writeStream, audio, email) => {
  if (files.length === 0) {
    const url = await uploadToStorage(originalName)
    if (url) {
      audio.audioUrl = url
      fs.rmSync(`./downloads/${originalName}`, { recursive: true, force: true })
      let slug
      try {
        await execute(createNewAudio, { body: audio, user: { roleId: 1 } })
        slug = slugify(audio.title + ' ' + audio.author, { lower: true, locale: 'vi' })
        sendMail(email, originalName, slug)
      } catch (err) {
        sendMail(email, originalName, slug)
      }
    }
    return
  }
  let nextFile = files.shift()
  const readStream = fs.createReadStream(`./downloads/${originalName}/${nextFile}`)
  readStream.pipe(writeStream, {end: false})
  readStream.on('end', async () => {
    return await recursiveStreamWriter(files, originalName, writeStream, audio, email)
  })
}

const convertTextToAudio = async (text, voice = "banmai") => {
  const response = await axios.post("https://api.fpt.ai/hmi/tts/v5", text, {
    headers: {
      api_key: process.env.FPT_TTS_KEY,
      voice: voice,
    },
  });

  return response.data.async;
};

const concatAudiosAndUpload = async (originalName) => {
  const dir = `./downloads/${originalName}`
  const files = fs.readdirSync(dir)
  const writeStream = fs.createWriteStream(`${dir}/${originalName}-final.mp3`)
  const readerStreams = files.map(file => fs.createReadStream(`${dir}/${file}`))
  for (let i = 0; i < readerStreams.length; i++) {
    readerStreams[i].pipe(writeStream).on('finish', async () => {
      if (i === readerStreams.length - 1) {
        await uploadToStorage(originalName)
      }
    })
  }
}

const downloadConvertedAudio = async (originalName, link) => {
  const dir = `./downloads/${originalName}`
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  const filename = `${dir}/${originalName}-${new Date().valueOf()}.mp3`
  const file = fs.createWriteStream(filename)
  await new Promise(resolve => setTimeout(resolve, 5000));
  const res = await axios({
    method: 'get',
    url: link,
    responseType: 'stream'
  })
  return res.data.pipe(file)
}

const uploadToStorage = async (originalName) => {
  const filename = `${originalName}-${new Date().valueOf()}.mp3`
  const storageFilePath = `audio/${filename}`
  const localFilePath = `./downloads/${originalName}/${originalName}-final.mp3`
  const file = await storage.bucket().upload(localFilePath, {
    destination: storageFilePath
  })
  const res = file.find(item => item.hasOwnProperty('mediaLink'))
  return res.mediaLink
}

const splitString = (n, str) => {
  let arr = str?.split(" ");
  let result = [];
  let subStr = arr[0];
  for (let i = 1; i < arr.length; i++) {
    let word = arr[i];
    if (subStr.length + word.length + 1 <= n) {
      subStr = subStr + " " + word;
    } else {
      result.push(subStr);
      subStr = word;
    }
  }
  if (subStr.length) {
    result.push(subStr);
  }
  return result;
};

const sendMail = (email, originalName, slug) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })

  const mailContent = slug
    ? `<p>Xin chào</p>
    <p>File PDF ${originalName} đã được chuyển đổi thành công.</p>
    <p>Xem chi tiết tại: <a href="http://localhost:3000/audio/${slug} target="_blank">http://localhost:3000/audio/${slug}</a>.</p>`
    : `<p>Xin chào</p>
    <p>File PDF ${originalName} chuyển đổi thất bại.</p>
    <p>Vui lòng kiểm tra lại.</p>`

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: slug ? 'Chuyển đổi audio thành công' : 'Chuyển đổi audio thất bại',
    html: mailContent
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
