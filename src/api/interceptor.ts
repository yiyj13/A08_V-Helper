import Taro from '@tarojs/taro'

const interceptor = function (chain: any) {
  const requestParams = chain.requestParams
  return chain.proceed(requestParams).then((res: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res
    } else if (res.statusCode === 401) {
      Taro.reLaunch({
        url: '/pages/login/index',
      })
    } else {
      return Promise.reject(res)
    }
    // TO BE ADDED...
  })
}

export const interceptors = [interceptor, Taro.interceptors.logInterceptor]
