import Taro from '@tarojs/taro'
import { getUserID } from '../models'
import {PICTURE_BASE_URL} from './config'

// imagePath: 需要上传的本地图片路径
// cloudPath: 希望图片存储在云端的路径
export async function uploadImage(imagePath: string, cloudPath: string) {
  return await Taro.uploadFile({
    url: `${PICTURE_BASE_URL}/upload`,
    filePath: imagePath,
    name: 'myFile',
    formData: {
      cloudpath: cloudPath,
    },
  })
}

export async function uploadAvatar(imagePath: string) {
  return await uploadImage(imagePath, 'user/' + getUserID())
}
