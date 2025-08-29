import { camelCase, snakeCase } from 'lodash'

/**
 * 将对象的键从下划线命名转换为驼峰命名
 * @param obj 需要转换的对象
 * @returns 转换后的对象
 */
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[camelCase(key)] = toCamelCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

/**
 * 将对象的键从驼峰命名转换为下划线命名
 * @param obj 需要转换的对象
 * @returns 转换后的对象
 */
export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[snakeCase(key)] = toSnakeCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}