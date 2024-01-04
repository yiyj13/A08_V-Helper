部署提示：

- 项目使用的包管理器为npm:

- 前置要求：安装Taro3.6.18命令行工具

```bash
npm i -g @tarojs/cli@3.6.18
```

```bash
npm i # 安装依赖
npm run dev:weapp # 编译小程序代码（开发环境）
npm run build:weapp # 编译小程序代码
```

- 编译后，使用微信开发者工具打开项目根目录即可预览项目

确保在本地设置中勾选不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书，才能连接后端服务。

- .env文件配置：
```bash
TARO_APP_SECRET_KEY={对称加密密钥}
TARO_APP_BASE_URL={后端api地址}
TARO_APP_PICTURE_BASE_URL={图床地址}
TARO_APP_WX_TMPL_IDS={微信模板消息id}
```
