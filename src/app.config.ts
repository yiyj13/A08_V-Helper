export default defineAppConfig({
  pages: [
    //
    'pages/index',
    'pages/community/articlepage/index',
    'pages/vacCalendar/index',
    'pages/sendpost/index',
    'pages/vacDetails/index',
    'pages/map/index',
    'pages/record/index',
    'pages/temper/index',
    'pages/my/about/index',
    'pages/my/notice/index',
    'pages/my/feedback/index',
    'pages/my/profile/index',
    'pages/my/follow/index',
    'pages/my/myposts/index',
    'pages/member/index',
    'pages/addMember/index',
    'pages/reference/index',
    'pages/record_history/index',
    'pages/temper_history/index',
    'pages/document/index',
    'pages/map/clinic/index',

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于小程序位置接口的效果展示',
    },
  },
  requiredPrivateInfos: ['getLocation'],
})
