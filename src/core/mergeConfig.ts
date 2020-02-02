import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/utils";

const strats = Object.create({})


// 默认合并策略
function defaultStart(val1:any, val2:any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 特殊的策略
function fromVal2Strat(val1: any, val2: any): any {
  if( typeof val2 !== 'undefined' ) {
    return val2
  }
}

function deepMeergeStart (val1: any, val2: any): any {
  if( isPlainObject(val2) ) {
    return deepMerge(val1, val2)
  }else if( typeof val2 !== 'undefined' ) {
    return val2
  }else if(isPlainObject(val1)) {
    return deepMerge(val1)
  }else if( typeof val1 !== 'undefined' ) {
    return val1
  }

}

// 指定某些字段的合并方式采用 deepMeergeStart
const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMeergeStart
})

// 指定这些字段使用 fromVal2Strat 方式合并
const stratKeysFromVal2 = [ 'url', 'params', 'data' ]
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})


export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig) {
  if( !config2 ) {
    config2 = {}
  }
  const config = Object.create(null)
  
  for( let key in config2 ) {
    mergeField(key)
  }

  for( let key in config1 ) {
    if( !config2[key] ) {
      mergeField(key)
    }
  }

  function mergeField(key: string ):void {
    // 利用策略模式， 针对不同的字段采用不同的合并方式
    const strat = strats[key] || defaultStart
    config[key] = strat(config1[key], config2![key])
  }

  return config
}