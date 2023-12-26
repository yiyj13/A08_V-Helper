import Taro from '@tarojs/taro'
import { getUserID } from '../models'

// imagePath: 需要上传的本地图片路径
// cloudPath: 希望图片存储在云端的路径
export async function uploadImage(imagePath: string, cloudPath: string) {
  return await Taro.uploadFile({
    url: 'http://101.43.194.58:8081/upload',
    filePath: imagePath,
    name: 'myFile',
    formData: {
      cloudpath: cloudPath,
    },
    success: (res) => {
      console.log(res)
    },
    fail: (err) => {
      console.log(err)
    },
  })
}

export async function uploadAvatar(imagePath: string) {
  return await uploadImage(imagePath, 'user/' + getUserID())
}
