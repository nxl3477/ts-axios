import { CancelExecutor, CancelTokenSource, Canceler } from "../types"
import Cancel from './Cancel'
interface ResolvePromise {
  ( reason?: Cancel ): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      // 把resolve 方法交给外部
      resolvePromise = resolve
    })

    // 调用callback ， 并传入一个取消请求的callback
    executor(message => {
      // 加锁，保证使用同一个 token 的两个请求， 只被调用一次
      if( this.reason ) {
        return 
      }
      this.reason = new Cancel(message)
      // 此处将promise 的状态改为 resolve
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if( this.reason ) {
      // 抛出原因， 中断请求
      throw this.reason
    }
  }

  // 看上去是提供了静态方法，实际上也是完成了实例化 CancelToken 的操作
  static source(): CancelTokenSource {
    // 调用过source 方法后 cancel 就必然会存在
    let cancel!: Canceler
    const token = new CancelToken(c => {
      // 此处也就获得了构造函数中传给callback的 取消方法
      cancel = c
    })

    return {
      cancel,
      // token 即 CancelToken 实例， 
      token
    }
  }
}