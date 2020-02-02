import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instence = Axios.prototype.request.bind(context)
  
  // 把 axios 势利上的方法都拷贝到 instance 上
  extend(instence, context)
  return instence as AxiosStatic
}

const axios = createInstance(defaults)
// 提供创建实例的方法
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios