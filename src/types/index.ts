// 请求方法的字面量类型
export type Method = 'get' | 'GET' 
  | 'delete' | 'Delete'
  | 'head' | 'HEAD' 
  | 'options' | 'OPTIONS' 
  | 'post' | 'POST' 
  | 'put' | 'PUT' 
  | 'patch' | 'PATCH'



// 定义类型

export interface AxiosRequestConfig {
  url?: string,
  method?: Method, // 可选参数
  data?: any, // 可选参数
  params?: any // 可选参数
  headers?: any,
  responseType?: XMLHttpRequestResponseType,
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken

  // 允许跨域携带cookie
  withCredentials?: boolean

  xsrfCookieName?:string
  xsrfHeaderName?: string

  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params:any) => string
  baseURL?: string

  // 字符串索引签名
  [propName: string]: any
}

// 范型默认值为 any
export interface AxiosResponse<T=any> {
  data: T,
  status: number,
  statusText: string,
  headers: any,
  config: AxiosRequestConfig,
  request: any
}


export interface AxiosPromise<T=any> extends Promise<AxiosResponse<T>> {
  
}

export interface AxiosError extends Error {
  isAxiosError: boolean,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
}


export interface Axios {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T=any>( config: AxiosRequestConfig): AxiosPromise<T>
  
  get<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}



export interface AxiosInstance extends Axios {
  <T=any>( config: AxiosRequestConfig ): AxiosPromise<T>

  // 函数重载
  <T=any>( url: AxiosRequestConfig, config?:AxiosRequestConfig ): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel:(value: any) => boolean

  // 封装 prmise.all
  all<T>(promises: Array<T | Promise<T>>) :  Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R):(arr: T[]) => R

  Axios: AxiosClassStatic
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}


// 响应拦截器， use方法类型， 接收两个方法, 返回拦截器的id
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number):void
}

// use方法第一个参数的类型
export interface ResolvedFn<T> {
  (val: T):T | Promise<T>
}

// use 方法第二个参数的类型
export interface RejectedFn {
  (error:any): any
}

export interface AxiosTransformer {
  (data:any, headers?: any ): any
}

// 请求取消方法
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// 单独定一个 static 方法是为了未实例化时的类型推断，  CancelToken 是为了对象实例后的类型推断
export interface CancelTokenStatic {
  new(executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}


export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new(message?:string): Cancel
}

// 验证，授权
export interface AxiosBasicCredentials {
  username: string,
  password: string
}