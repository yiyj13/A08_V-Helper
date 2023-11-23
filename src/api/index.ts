import Taro from '@tarojs/taro'
import { StorageSceneKey } from '../utils'

// TODO:
class Http {
  private static instance: Http

  private constructor() {}

  public static getInstance(): Http {
    return this.instance || (this.instance = new Http())
  }

  public async request(options: Taro.request.Option) {
    const BASE_URL = 'http://127.0.0.1:9527' // mockjs default url

    const { url, method = 'GET', data } = options
    const token = Taro.getStorageSync(StorageSceneKey.USER)
    const header = {
      'content-type': 'application/json',
      Authorization: token,
    }

    return await Taro.request({
      url: BASE_URL + url,
      method,
      data,
      header,
    })
  }
}

export default Http.getInstance()
