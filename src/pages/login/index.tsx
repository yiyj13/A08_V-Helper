import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'

import { useUserStore } from '../../models'

// import api from '../../api'

export default function Index() {
  const setToken = useUserStore.use.setToken()

  const handleLogin = () => {
    // api
    //   .request({
    //     url: '/api/login',
    //     method: 'POST',
    //   })
    //   .then((res) => {
    //     setToken(res.data.token)
    //     goIndex()
    //   })
    setToken('tokenForTest')
  }

  return (
    <View className='grid place-items-center h-screen w-3/5 m-auto'>
      <View className='text-3xl font-bold'>V-Helper</View>
      <Button type='primary' className='mt-4 text-lg font-bold shadow-xl' onClick={handleLogin} size='large'>
        Login
      </Button>
    </View>
  )
}
