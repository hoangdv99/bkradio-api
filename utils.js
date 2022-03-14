import { camel, snake } from "to-case/lib/cases"

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
