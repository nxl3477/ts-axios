import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>,
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors:Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  // 增加拦截器的方法， 并返回拦截器id
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  // 提供外部访问遍历, 接收一个callback
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if( interceptor !== null) {
        fn(interceptor)
      }
    })
  }
  
  // 根据拦截器的id, 取消拦截器的方法
  eject(id: number): void {
    if( this.interceptors[id] ) {
      this.interceptors[id] = null
    }
  }
}