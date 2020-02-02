/*
 * @Descripttion: 实现cookie读取
 * @version: 0.0.01
 * @Author: Nxl3477
 * @Date: 2020-01-30 19:34:27
 * @LastEditors  : Nxl3477
 * @LastEditTime : 2020-01-30 19:38:11
 */
const cookie = {
  read(name: string) : string | null {
    // 匹配 cookie 的表达式
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie