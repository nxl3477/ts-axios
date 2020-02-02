import { isPlainObject } from './utils' 
/**
 * @msg: 处理 body
 * @param {type} 
 * @return: 
 */
export function transformRequest (data: any): any {
  if(isPlainObject(data) ) {
    return JSON.stringify(data)
  }
  return data
}


export function transformResponse(data:any): any {
  if(typeof data === 'string' ) {
    try {
      data = JSON.parse(data)
    }catch(e) {
      
    }
  }
  return data
}