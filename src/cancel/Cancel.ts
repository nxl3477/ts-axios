/*
 * @Descripttion: 就是把取消的原因封装成普通的类， 好提供一个 isCancel 方法用来判别是否是同一个取消操作
 * @version: 0.0.01
 * @Author: Nxl3477
 * @Date: 2020-01-30 11:12:00
 * @LastEditors  : Nxl3477
 * @LastEditTime : 2020-01-30 17:36:04
 */


export default class Cancel {
  message?: string
  constructor( message?: string ) {
    this.message = message
  }
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel
}