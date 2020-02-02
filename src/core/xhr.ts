import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'

import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default function xhr (config: AxiosRequestConfig):AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null , url, method ='get', headers, responseType, timeout, cancelToken, withCredentials, xsrfHeaderName, xsrfCookieName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config
    const request = new XMLHttpRequest()

    request.open(method.toLocaleUpperCase(), url!, true)

    // 配置request  
    configureRequest()
    // 增加事件处理函数
    addEvents()
    // 处理请求头
    processHeaders()
    // 处理取消请求逻辑
    processCancel()
    
    request.send(data)

    function configureRequest(): void {
      if( responseType ) {
        request.responseType = responseType
      }
      if( timeout ) {
        request.timeout = timeout
      }
      // 处理跨域请求时携带cookie
      if( withCredentials ) {
        request.withCredentials = withCredentials
      }

      // 监听上传路径
      if( onUploadProgress ) {
        request.upload.onprogress = onUploadProgress
      }

    }



    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if( request.readyState !== 4 ) {
          return 
        }
  
        // 处理非200状态码
        if( request.status === 0 ) {
          return 
        }
  
        const reponseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType === 'text' ? request.responseText : request.response
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: reponseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      
      // 网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 请求超时处理
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      // 监听下载进度
      if( onDownloadProgress ) {
        request.onprogress = onDownloadProgress 
      }

      
    }

    function handleResponse(response: AxiosResponse):void {
      // 如果用户传空就认为所有status 都是合法的
      if( !validateStatus || validateStatus(response.status) ) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status ciode ${response.status}`, config, null, request, response))
      }
    }



    function processHeaders(): void {
      // 如果是 formData 类型的上传文件操作，则删除contenttype， 让浏览器自己去设置contentType
      if( isFormData(data) ) {
        delete headers['Content-Type']
      }


      // 处理 csrf 安全问题
      if( (withCredentials || isURLSameOrigin(url!)) &&  xsrfCookieName ) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if( xsrfValue && xsrfHeaderName ) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // 携带权限头
      if(auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }
      
      Object.keys(headers).forEach(name => {
        if( data === null && name.toLowerCase() === 'content-type' ) {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      // 此处提供取消请求的方法
      if( cancelToken ) {
        cancelToken.promise.then(reason => {
          // 取消请求
          request.abort()
          reject(reason)
        })
      }
    }
  })
}
