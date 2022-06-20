
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10mb
  }
})

export const fileUploadMiddleware = (req, res, next) => {
  if (
    /^\/audios\/convert$/.test(req.path) &&
    typeof req.method === 'string' &&
    req.method.toLowerCase() === 'post'
  ) {
    return upload.array('files', 10)(req, res, next)
  }

  return next()
}

export const handleMulterError = (error, req, res) => {
  const errorMessage = error.field
    ? `${error.message}: \`${error.field}\``
    : `${error.message}`
  return res.status(400).json({
    message: errorMessage
  })
}

export const isMulterError = (error) => {
  return error.name && error.name === 'MulterError'
}
