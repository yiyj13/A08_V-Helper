import Taro from '@tarojs/taro'
import { resetUser } from '../models'

const interceptor = function (chain: any) {
  const requestParams = chain.requestParams
  return chain.proceed(requestParams).then((res: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res
    } else if (res.statusCode === 401) {
      resetUser()
      Taro.showToast({
        title: '登录状态过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      return Promise.reject(res)
    }
    // TO BE ADDED...
  })
}

const __interceptors = [interceptor]
if (process.env.NODE_ENV === 'development') {
  __interceptors.push(Taro.interceptors.logInterceptor)
}
export const interceptors = __interceptors
