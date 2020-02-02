import { AxiosTransformer } from "../types";

// 整个transform 方法就等于一个pipe ， 管道式调用了传入的转换器， 将上一个转换器返回的结果作为下一个转换器的参数传入
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
  if( !fns ) {
    return data
  }
  if( !Array.isArray(fns) ) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}