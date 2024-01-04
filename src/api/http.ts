import Taro from '@tarojs/taro'
import { useUserStore } from '../models'
import { BASE_URL } from './config'
import { interceptors } from './interceptor'

interceptors.forEach((interceptor) => Taro.addInterceptor(interceptor))

// TODO:
class Http {
  private static instance: Http

  private constructor() {}

  public static getInstance(): Http {
    return this.instance || (this.instance = new Http())
  }

  public request(params: Taro.request.Option & { contentType?: string }) {
    let url = BASE_URL + params.url

    let method = params.method || 'GET'

    const header = {
      'content-type': params.contentType || 'application/json',
      Authorization: 'Bearer ' + useUserStore.getState().token,
    }

    return Taro.request({
      ...params,
      url,
      method,
      header,
    })
  }

  public get(url: string, data?: any) {
    return this.request({ url, data })
  }

  public post(url: string, data?: any, contentType?: string) {
    return this.request({ url, method: 'POST', data, contentType })
  }

  public put(url: string, data?: any) {
    return this.request({ url, method: 'PUT', data })
  }

  public delete(url: string, data?: any) {
    return this.request({ url, method: 'DELETE', data })
  }
}

export default Http.getInstance()
