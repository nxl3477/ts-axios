import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types' 
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import xhr from './xhr'
import transform from './transform'

function axios (config: AxiosRequestConfig):AxiosPromise {
  // 发送请求前发送这个函数检测是否已经调用过请求的取消
  throwIfCancellationRequested(config)
  // 配置的格式转化
  processConfig(config)
  // 真正的发送请求 ， 并格式化返回数据
  return xhr(config).then(res => transformResponseData(res))
}
// 统一调度格式化逻辑
function processConfig(config: AxiosRequestConfig):void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if( baseURL && !isAbsoluteURL(url!) ) {
    url = combineURL(baseURL, url)
  }
  // 感叹号表示不为空
  return buildURL(url!, params, paramsSerializer)
}

// 尝试将返回值转换为json
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}


function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if( config.cancelToken ) {
    config.cancelToken.throwIfRequested()
  }
}

export default axios