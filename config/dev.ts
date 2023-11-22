module.exports = {
  plugins: ['@tarojs/plugin-mock'],
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: process.env.TARO_APP_API,
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  }
}
