import Taro from '@tarojs/taro'
import { WX_TMPL_IDS } from './config'

export async function pushWXSubscription(props?: Taro.requestSubscribeMessage.Option) {
  return await Taro.requestSubscribeMessage({
    ...props,
    tmplIds: WX_TMPL_IDS,
  })
}
