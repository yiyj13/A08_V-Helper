export default defineAppConfig({
  pages: [
    //
    'pages/index',
    'pages/sendpost/index',
    'pages/vacDetails/index',
    'pages/blank/index',
    'pages/enquiry/index',
    'pages/record/index',
    'pages/temper/index',
    'pages/my/about/index',
    'pages/my/notice/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于小程序位置接口的效果展示',
    },
  },
  requiredPrivateInfos: ['getLocation'],
})
