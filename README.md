# ChatGPT 正式版

> 免费版只有首页、历史对话、我的等部分前端页面  
> 源码版含有完整前台功能、后台、接口平台、socket服务平台，不包搭建但可给搭建教程，具体咨询作者  
> 搭建或定制化可联系作者  
> QQ：838354994  

## 平台兼容

| H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 小程序 | App |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | --- |
| √   | √          | 未测            | 未测       | √          | 未测         | 未测   |

## 功能
- 会员功能（小程序自动登陆、普通签到、视频签到、积分、会员购买、分销、分享、海报生成、佣金提现等）
- AI对话 (历史对话、关联上下文、语音功能、支持stream流式输出)
- 管理后台 (php、key无用自动踢除、key一键余额查询数据同步、用户积分规则配置、用户分享和视频次数配置、签到配置、会员购买订单记录、会员列表等)
- 接口平台 (PhalApi 2.x、高性能接口框架易扩展、代码规范)
- WebSocket (SW-X、高性能框架易扩展)

## 后端
- 接口平台：PHP
- 管理后台：PHP
- WebSocket: PHP+Swoole

## 配置
- /store/index.js里的adConfig参数配置微信和抖音的激励广告ID
- /api/wiseApi.js 里配置接口平台的域名和密钥
- /api/wiseSocket.js 里配置socket服务的域名和密钥
- 更多配置和搭建教程有时间在整理更新，目前新功能迭代请大家谅解

## 界面1
![](https://github.com/jasonsooo/chatgpt/blob/main/111.jpg)

## 界面2
![](https://github.com/jasonsooo/chatgpt/blob/main/222.png)

## 界面3
![](https://github.com/jasonsooo/chatgpt/blob/main/333.png)

## 界面4
![](https://github.com/jasonsooo/chatgpt/blob/main/444.png)

## 界面5
![](https://github.com/jasonsooo/chatgpt/blob/main/555.png)
