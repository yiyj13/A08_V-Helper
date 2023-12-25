import Taro from '@tarojs/taro';

export async function uploadImage(imageFile, cloudPath) {
  Taro.uploadFile({
    url: 'http://101.43.194.58:8081/upload',
    filePath: imageFile,
    name: 'myFile',
    formData:{
      'cloudpath': cloudPath
    },
    success: (res) => {
      console.log(res)
    },
    fail: (err) => {
      console.log(err)
    }
  })
}