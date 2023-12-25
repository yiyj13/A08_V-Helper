import Taro from '@tarojs/taro';

// imagePath: 需要上传的本地图片路径
// cloudPath: 希望图片存储在云端的路径
export async function uploadImage(imagePath, cloudPath) {
  Taro.uploadFile({
    url: 'http://101.43.194.58:8081/upload',
    filePath: imagePath,
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