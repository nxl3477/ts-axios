/*
 * @Descripttion: 
 * @version: 0.0.01
 * @Author: Nxl3477
 * @Date: 2020-01-27 19:12:11
 * @LastEditors  : Nxl3477
 * @LastEditTime : 2020-01-30 21:49:35
 */
import { isDate, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

// 转译并保留部分的特殊字符
function encode(val:string):string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/g, ',')
    .replace(/%20/g, ' ')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
    
}

// 根据参数构建url
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string):string {
  if(!params) {
    return url
  }
  let serializedParams 
  // 优先使用用户传入的方法
  if( paramsSerializer ) {
    serializedParams = paramsSerializer(params)
    // 判断是否是  URLSearchParams 类型
  }else if(isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach((key) => {
      const val = params[key]
      if(val === null || typeof val === 'undefined') {
        return 
      }
      let values = []
      if(Array.isArray(val)) {
        values = val
        key += '[]'
      }else {
        values = [val]
      }

      values.forEach(val => {
        if( isDate(val) ) {
          // 这里需要使用类型保护， 使得ts能够确认val一定存在 toISOString() 方法
          val = val.toISOString()
        }else if(isPlainObject(val) ){
          val = JSON.stringify(val)
        }

        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    serializedParams = parts.join('&')
  }

  // 判断用户传入的 url 是否本身已携带 ? # 
  if(serializedParams) {
    const markIndex = url.indexOf('#')
    if( markIndex !== -1 ) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&' ) + serializedParams
  }

  return url
}

const currentOrigin = resolveURL(window.location.href)

// 判断是否同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}


// 利用 a 标签， 根据url解析出 protocol 和 host
function resolveURL(url: string): URLOrigin {
  const urlParsingNode = document.createElement('a')
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  
  return {
    protocol,
    host
  }
}

// 请求地址是否是绝对地址
export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}


export function combineURL(baseURL:string, relativeURL?: string): string {
  // 对用户填写的多个斜线进行容错处理
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/\/+$/, '') : baseURL
}