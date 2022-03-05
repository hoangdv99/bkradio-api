import { camel } from "to-case/lib/cases"

export function camelize(obj) {
  return Object.entries(obj).reduce((o, [key, value]) => {
      o[camel(key)] = value
      return o
  }, {})
}
