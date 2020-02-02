import { isPlainObject, deepMerge } from './utils'
import { Method } from '../types'

// 给指定的header 转换大小写
function normalizeHeaderName(headers: any, normalizedName: string) : void {
  if( !headers) {
    return
  }

  Object.keys(headers).forEach(name => {
  // 相同的header， 但是大小写不相同的header
    if(name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
    headers[normalizedName] = headers[name]
    delete headers[name]
    }
  })
}
// 设置请求头
export function processHeaders(headers: any, data: any) : any {
  normalizeHeaderName(headers, 'Content-Type')

  if( isPlainObject(data) ) {
    if( headers && !headers['Content-Type'] ) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}



export function parseHeaders(headers:string): any {
  let parsed = Object.create(null)
  if( !headers ) {
    return parsed
  }
  
  headers.split('\r\n').forEach((line) => {
    let [ key , val ] = line.split(':')
    key = key.trim().toLowerCase()
    if(!key ) {
      return 
    }
    if(val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}

// 合并header配置， 优先顺序 commom < 特定 method 配置 < 请求时单独配置
export function flattenHeaders( headers: any, method: Method ): any {
  if( !headers ) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}