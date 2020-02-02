import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn, AxiosInstance } from "../types";
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from "./interceptorManager";
import mergeConfig from "./mergeConfig";

// 定义请求拦截器，和响应拦截器的接口
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}


// promise链
interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise )
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  // 实现拦截器方法
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    // 定义两个拦截器方法实例， 并传入范型， 因为拦截器本质上是一样的， 只是返回类型不一样，所以使用范型
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }


  // 处理不同形式的传参方式， 实现重载
  request(url: any, config?: any): AxiosPromise {
    if( typeof url === 'string' ) {
      if( !config ) {
        config = {}
      }
      config.url = url
    }else {
      config = url
    }
    // 传入配置 与 默认配置合并
    config = mergeConfig(this.defaults, config)

    // 请求链，dispatchRequest 被放在了数组的最中间，  整个流程如此： 请求拦截3 -> 请求拦截2 -> 请求拦截1 -> 请求逻辑 -> 返回响应 -> 响应拦截1 -> 响应拦截2 -> 响应拦截3
    const chain:PromiseChain<any>[]  = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]
    // 请求拦截器， 先挂载的后执行
    this.interceptors.request.forEach(interfaceptor => {
      chain.unshift(interfaceptor)
    })
    // 响应拦截器， 先挂载的先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    // 把默认的config 封装成 promise
    let promise = Promise.resolve(config)

    // 将拦截器数组前后链接上， 实现链式调用
    while(chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }


  options(url: string, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }


  post(url: string, data?: any, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig ): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config!)
  }


  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      data,
      url
    }))
  }


  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url
    }))
  }
}