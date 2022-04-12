import { camel, snake } from "to-case/lib/cases"
import httpMocks from 'node-mocks-http'

export function camelize(obj) {
  return Object.entries(obj).reduce((o, [key, value]) => {
    o[camel(key)] = value
    return o
  }, {})
}

export function toSnakeCase(obj) {
  return Object.entries(obj).reduce((o, [key, value]) => {
    o[snake(key)] = value
    return o
  }, {})
}

export async function execute(func, req, res) {
  const mockReq = httpMocks.createRequest(req)
  if (res) {
    return await func(mockReq, res)
  } else {
    const mockRes = res || httpMocks.createResponse()
    mockRes.send = result => {
      mockRes.res = result
    }
    await func(mockReq, mockRes)
    return mockRes
  }
}
