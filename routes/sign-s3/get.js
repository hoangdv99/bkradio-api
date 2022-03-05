import AWS from 'aws-sdk'

export default async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.REGION
  })
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.REGION
  })
  const fileName = req.query.fileName
  const fileType = req.query.fileType
  const s3Params = {
    Bucket: process.env.BUCKET,
    Key: fileType === 'audio' ? `audios/${fileName}` : `thumbnails/${fileName}`,
    Expires: 60,
    ContentType: fileType === 'audio' ? 'audio/*' : 'image/*',
  }

  const signedUrl = await s3.getSignedUrlPromise('putObject', s3Params)

  return res.status(200).json({
    signedUrl,
    fileUrl: `https://${process.env.BUCKET}.s3.ap-southeast-1.amazonaws.com/${fileType === 'audio' ? 'audios' : 'thumbnails'}/${fileName}`
  })
}
