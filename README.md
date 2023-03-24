# ChatGPT 正式版

> 免费版只有首页、历史对话、我的等部分前端页面  
> 源码版含有完整前台功能、后台、接口平台、socket服务平台，不包搭建但可给搭建教程，具体咨询作者  
> 搭建或定制化可联系作者  
> QQ：838354994  

## 平台兼容

| H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 小程序 | App |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | --- |
| √   | √          | 未测            | 未测       | √          | 未测         | 未测   |

## 后端
- 接口平台：PHP
- 管理后台：PHP
- WebSocket: PHP+Swoole

## 配置
- /store/index.js里的adConfig参数配置微信和抖音的激励广告ID
- /api/wiseApi.js 里配置接口平台的域名和密钥
- /api/wiseSocket.js 里配置socket服务的域名和密钥