import fs from "fs";
import PDF from "pdf-parse/lib/pdf-parse";
import axios from "axios";
import got from 'got'
import { storage } from '../../../storage'
import getVoice from '../../voices/_id/get'
import { execute } from '../../../utils'

export default async (req, res) => {
  const { buffer, originalname } = req.files[0];
  const originalName = originalname.split('.')[0]
  const content = await PDF(buffer);
  const chunks = splitString(5000, content.text);
  const { voiceId } = req.body

  const result = await execute(getVoice, { params: { id: voiceId } })
  const { ttsValue } = result.res

  try {
    const convertedLinks = []
    for (let i = 0; i < chunks.length; i++) {
    const convertedLink = await convertTextToAudio(chunks[i], ttsValue)
      convertedLinks.push(convertedLink)
    }

    for (let i = 0; i < convertedLinks.length; i++) {
      await downloadConvertedAudio(originalName, convertedLinks[i])
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    const dir = `./downloads/${originalName}`
    const files = fs.readdirSync(dir)
    const writeStream = fs.createWriteStream(`${dir}/${originalName}-final.mp3`)
    const readerStreams = files.map(file => fs.createReadStream(`${dir}/${file}`))
    for (let i = 0; i < readerStreams.length; i++) {
      readerStreams[i].pipe(writeStream).on('finish', async () => {
        if (i === readerStreams.length - 1) {
          const url = await uploadToStorage(originalName)
          fs.rmSync(dir, { recursive: true, force: true });
          res.send({ url })
        }
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      message: 'Có lỗi xảy ra'
    })
  }
};

const convertTextToAudio = async (text, voice = "banmai") => {
  const response = await axios.post("https://api.fpt.ai/hmi/tts/v5", text, {
    headers: {
      api_key: "KwIL1U3R5cv6Q52r0XK6rxIvw6LmLWYI",
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
