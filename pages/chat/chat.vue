<template>
	<view class="body">
		//#ifdef MP-WEIXIN
		<ad-rewarded-video ref="adRewardedVideo" :adpid="weiXinRewardedAdId" :preload="false" :loadnext="false" :disabled="true" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror"></ad-rewarded-video>
		//#endif
		<dialogue></dialogue>
		<adPopup ref="adPopup"></adPopup>
		<scroll-view scroll-y="true" class="chat_body" :scroll-top="scrollTop" scroll-with-animation="true">
			<!-- 用来获取消息体高度 -->
			<view id="chat" class="cu-chat">
				<!-- 消息 -->
				<view v-for="(x,i) in msgList" :key="i">
					<!-- 用户消息 -->
					<view v-if="x.my" class="cu-item self">
						<view class="main">
							<view class="content bg-blue">
								<text selectable="true" user-select="true">{{x.msg}}</text>
							</view>
						</view>
						<view class="avatar-wrapper">
							<image class="cu-avatar" :src="userInfo.user_avatar" mode="aspectFill"></image>
						</view> 
					</view>
					<!-- 机器人消息 -->
					<view v-if="!x.my" class="cu-item">
						<image class="cu-avatar" src="/static/images/robt.png" mode="aspectFill" ></image>
						<view class="main">
						  <view class="content bg-white">
							<text selectable="true" user-select="true">{{x.msg}}</text>
							<view v-if="x.new" class="line"></view>
							<view v-if="x.new" class="content_button_view">
								<button class="content_button" @tap="copyMsg(x.msg)"><uni-icons custom-prefix="iconfont" type="icon-fuzhi" size="22rpx" color="#989c9c"></uni-icons>&nbsp;复制</button>	
								<button class="content_button" open-type="share"><uni-icons custom-prefix="iconfont" type="icon-zhuanfa" size="25rpx" color="#989c9c"></uni-icons>&nbsp;转发</button>
							</view>
						  </view>
						</view>
					</view>
				</view>
				<!-- loading是显示 -->					
				<view v-if="msgLoad" class="cu-item">
					<image class="cu-avatar" src="/static/images/robt.png" mode="aspectFill" ></image>
					<view class="main">
					  <view class="contentload bg-white">
						<view><view class="loading"></view><view class="loading"></view><view class="loading"></view></view>
					  </view>
					</view>
				</view>
				<view v-if="msgTimeoutLoad" class="timeout_tip">当前查询人数过多，请耐心等待</view>
			</view>
			<!-- 防止消息底部被遮 -->
			<view style="height: 200rpx;"></view>
		<!-- 底部导航栏 -->
		<view class="search" :style="{'padding-bottom':inputBottom+'px'}">
			<!-- vue无法使用软键盘"发送" -->
			<input v-model="msg" class="search_input" type="text" @confirm="sendMsg(true)" confirm-type="search" placeholder-class="search_input_placehold" placeholder="请描述您的问题" :adjust-position="false" @focus="inputBindFocus" @blur="inputBindBlur" />
			<view v-if="msgLoad === false"> 
				<button @click="sendMsg(true)" :disabled="msgLoad" class="bg-cyan search_button"><image src="/static/images/send.png" style="width: 30rpx; height: 30rpx;"></image></button>
			</view>
			<view v-if="msgLoad === true" class="bg-cyan search_button2"><view class="loading"></view><view class="loading"></view><view class="loading"></view></view>
		</view>
		</scroll-view>
	</view>
</template>

<script>
import {mapState} from 'vuex'
import {sha256} from 'js-sha256'

export default {
	onLoad() {
		let that = this;
		uni.getStorage({
			key: 'msg',
			success: function (res) {
				that.msg = res.data;
				uni.removeStorage({
					key: 'msg',
					success: function (res) {
						that.sendMsg(false);
					}
				});
			}
		});
		
		//#ifdef MP-TOUTIAO
		// 抖音激励广告
		this.douyinAd = tt.createRewardedVideoAd({
		  adUnitId: this.adConfig.douYinRewardedAdId,
		});
		this.douyinAd.onError((err) => {
			this.onaderror(err);
		});
		this.douyinAd.onClose((data) => { // 监听视频播放
			this.onadclose(data);
		});
		this.douyinAd.load(); // 预加载广告
		//#endif
		
		// 显示历史消息
		let pages = getCurrentPages();
		let curPage = pages[pages.length - 1]
		//#ifndef H5
		let msgAllListIndex = curPage.options.msgAllListIndex
		//#endif
		//#ifdef H5
		let msgAllListIndex = curPage.$page.options.msgAllListIndex
		//#endif
		if (msgAllListIndex != undefined) {
			this.msgAllListIndex = msgAllListIndex
			this.msgList = this.msgAllList[msgAllListIndex]
		}
	},
	onShow() {
		//#ifdef MP-WEIXIN
		this.shareSuccess(); // 显示页面时判断是否点击了分享按钮
		//#endif
	},
	computed: {
		...mapState([
			'msgAllList', // 所有对话记录
		])
	},
	data() {
		return {
			//#ifdef MP-WEIXIN
			weiXinRewardedAdId: getApp().globalData.weiXinRewardedAdId,
			//#endif
			scrollTop: 0,
			msgLoad: false,
			msgTimeoutLoad: false,
			userId: Math.round(new Date().getTime() / 1000).toString(),
			msgList: [
				{
					my: false,
					msg: "您好，我是AI，可以回答您的任何问题！",
					new: false
				}
			],
			msgAllListIndex: "Chat" + new Date().getTime() + Math.floor(Math.random() * 100 + 1),
			msgContent: "",
			msg: "",
			inputBottom: 0
		}
	},
	methods: {
		sendMsg(scrollbottom) {
			let that = this
			this.inputBottom = 0
			 
			if (this.msg == "" || this.msgLoad) {
				return 0;
			}

			if (this.msg.length < 2) {
				uni.showToast({
					icon: 'none',
					title: '请至少输入2个字'
				});
				return 0;
			}

			this.msgLoad = true
			if (this.userInfo.points <= 0) { // 积分已用完
				this.$refs.adPopup.show();
				this.msgLoad = false
				return 0;
			}
			this.questionsUseNumPlus(); // 增加使用次数
			
			if (scrollbottom) { // 滚动到底部
				this.scrollbottom();
			}
			
			this.msgList.push({
				"msg": this.msg,
				"my": true,
				"new": true
			});
			
			// 超过10秒显示耐心等待
			this.msgTimeoutLoadTimer = setTimeout(function(){
				that.msgTimeoutLoad = true
			},10000);
			
			this.wisefintApi(0);
		},
		wisefintApi(retryNum) {
			let that = this
			
			let requestData = this.requestDataSign(this.msgContent + this.userId + ":" + this.msg + "\n");
			uni.request({
				url: "XXXXX",
				data: requestData.requestData,
				header: "Signature",
				header: {
					'Signature': requestData.signature
				},
				method: "POST",
				success: (res) => {
					if (res.statusCode == 200) {
						if (res.data.ret == 200) {
							this.msgContent += (this.userId + ":" + this.msg + "\n")
							let msgText = res.data.data
							.replaceAll("openai:", "")
							.replaceAll("openai：", "")
							.replaceAll("openAI:", "")
							.replaceAll("openAI：", "")
							.replaceAll("OpenAi:", "")
							.replaceAll("OpenAi：", "")
							.replaceAll("OpenAI：", "")
							.replaceAll("OpenAI:", "")
							.replaceAll("OpenAI", "明智AI")
							.replaceAll(this.userId+":", "")
							.replaceAll(this.userId+"：", "")
							.replaceAll(/^\n|\n$/g, "")
							this.msgList.push({
								"msg": "_",
								"my": false,
								"new": true
							});
							this.msgContent += ("openai:" + msgText + "\n")
							
							let msgIndex = this.msgList.length - 1
							let i = 0;
							let timer = setInterval(function(){
									if (i <= msgText.length) {
										i = i + Math.floor(Math.random() * 5 + 1)
										that.msgList.splice(msgIndex, 1, {
											"msg": msgText.slice(0, i) + ' _',
											"my": false,
											"new": true
										});
									} else {
										that.msgList.splice(msgIndex, 1, {
											"msg": msgText,
											"my": false,
											"new": true
										});
										clearInterval(timer)
										that.scrollbottom(); // 滚动到底部
									}
									that.saveMsg(); // 保存消息到全局
							}, 120);
							
							clearTimeout(this.msgTimeoutLoadTimer)
							this.msgTimeoutLoad = false
							this.msgLoad = false
							this.msg = "" // 清空输入框内容
						} else if (res.data.ret == 428 && retryNum == 0) { // token过长且没有重试过
							this.msgContent = "" // 清空上下文
							this.wisefintApi(retryNum+1)
						} else if (res.data.ret == 429 && retryNum < 3) { // 服务器繁忙重试且重试次数小于3
							this.wisefintApi(retryNum+1)
						} else if (res.data.ret == 406) { // 内容存在违禁词
							let msgIndex = this.msgList.length - 1
							this.msgList.splice(msgIndex)
							uni.showToast({
								icon: 'none',
								title: '内容存在违禁词语'
							});
							clearTimeout(this.msgTimeoutLoadTimer)
							this.msgTimeoutLoad = false
							this.msgLoad = false
							this.msg = "" // 清空输入框内容
						} else {
							uni.showToast({
								icon: 'none',
								title: '当前请求人数过多，请重试'
							});
							clearTimeout(this.msgTimeoutLoadTimer)
							this.msgTimeoutLoad = false
							this.msgLoad = false
							this.msg = "" // 清空输入框内容
						}
						
					}
				},
				fail: (err) => {
					uni.showToast({
						icon: 'none',
						title: '系统更新请重新运行'
					});
					clearTimeout(this.msgTimeoutLoadTimer)
					this.msgTimeoutLoad = false
					this.msgLoad = false
					this.msg = "" // 清空输入框内容
				}
			})
		},
		copyMsg(msg) {
			uni.setClipboardData({
				data: msg,
				success: () => {
					uni.showToast({
						icon: 'none',
						title: '复制成功'
					});
				}
			});
		},
		hideKey() {
			uni.hideKeyboard();
		},
		saveMsg() {
			let msgAllList = this.msgAllList
			msgAllList[this.msgAllListIndex] = this.msgList
			uni.setStorage({
				key: 'msgAllList',
				data: JSON.stringify(msgAllList)
			});
		},
		inputBindFocus(e) {
			if (e.detail.height) {
			  this.inputBottom = e.detail.height
			}
		},
		inputBindBlur() {
			this.inputBottom = 0
		},
		scrollbottom() { // 滚动到底部
			const query = uni.createSelectorQuery().in(this);
			query.select('#chat').boundingClientRect(data => {
				this.scrollTop = data.height + Math.random()
			}).exec();
		},
		randomNum(n) { // 生成任意长随机数方法
			var t = '';
			for (var i = 0; i < n; i++) {
			  t += Math.floor(Math.random() * 10);
			}
			return t;
		},
		requestDataSign(data) { // 生成签名
			let requestData = {
				content: data,
				text: this.msg,
				//#ifdef MP-TOUTIAO
				source: "douyin",
				//#endif
				timestamp: Math.round(new Date().getTime() / 1000).toString(),
				nonce: this.randomNum(16)
			}
			
			// 签名方法省略
			
			return {"signature": signature, "requestData": requestData}
		} 
	}
}
</script>

<style>
page {background-color:#F9F8FD;}

.body {
	width: 100%;
	height: 100vh;
}

.chat_body {
	width: 100%;
	height: 100vh;
	overflow: hidden;
}

.search {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: fixed;
	z-index: 99;
	bottom: 30rpx;
	width: 100%;
}
.search_input {
	width: 60%;
	height: 100rpx;
	background-color: #FFF;
	border-radius: 50rpx;
	padding: 0rpx 50rpx;
	font-size: 30rpx;
	margin-right: 20rpx;
	border:none;
}
.search_input_placehold {
	color: #BBB;
}
.search_button {
	width: 100rpx;
	height: 100rpx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: #122d59;
	border: none;
}
.search_button::after {
	border: none;
}
.search_button2 {
	width: 100rpx;
	height: 100rpx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background-color: #F0F0F0;
	outline: none;
	border: none;
}

.flex-row-start {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}
.hui-box {
	width: 750rpx;
	height: 100%;

}

.box-normal {
	width: 750rpx;
	height: 180px;
	background-color: #FFFFFF;
}

.tb-text view {
	font-size: 65rpx;
}

.tb-text text {
	font-size: 25rpx;
	color: #737373;
}

.padding-chat {
	padding: 17rpx 20rpx;
}

.tb-nv {
	width: 50rpx;
	height: 50rpx;
}

.status_bar {
	     height: var(--status-bar-height);
		 background-color: #f1f1f1;
	     width: 100%;

	 }
.status_bar-nobg {
	     height: var(--status-bar-height);
	     width: 100%;

	 }
/* 转圈动画 */
.one-show{
	animation: oneshow 0.8s ease 1;
}
@keyframes oneshow{
  from{opacity: 0;}
  to{opacity: 1;}
}
.status_bar-fixed{
	height: var(--status-bar-height);
	width: 100%;
	position: fixed;
	background-color: #f1f1f1;
	z-index: 20;
}
.head-dh-my{
	display: flex;
	position: fixed;
	justify-content: space-around;
	align-items: flex-end;
	padding-bottom: 10rpx;
	z-index: 15;
	background-color: #e3e3e3;
	width: 750rpx;
}
	 .border-bom{
		 border-bottom:0.5rpx solid #DDDDDD ;
	 }
	 .border-red{
	 		 border-bottom:1rpx solid #d33e18;
	 }
	 .border-bom-big{
	 		 border-bottom:8rpx solid #DDDDDD ;
	 }
	 .border-bom-white{
	 		 border-bottom:2rpx solid #FFFFFF ;
	 }
	 .border-bom-green{
	 		 border-bottom:4rpx solid #f8f9bd;
	 }
	 .border-bom-index{
	 		 border-bottom:4rpx solid #27d9b3;
	 }
	 .padding-left{
		 padding-left: 20rpx;
	 }
	 .padding-left-top{
	 		 padding-left: 20rpx;
			 padding-top: 20rpx;
	 }
	 .padding-right{
	 		 padding-right: 20rpx;
	 }
	 .input-my{
		padding-left: 20rpx;
	 	border-radius: 40rpx;
	 	height: 50rpx;
	 	margin: 10rpx;
	 }
	 .tb-tag-absolute{
	 	position: absolute;
	 	z-index: 5;
	 	border-radius: 25rpx;
	 	font-size: 16rpx;
	 	margin-left: 25rpx;
	 	margin-top:-35rpx;
	 }
	 .lk-tag{
		 height: 50rpx;
		 padding: 0 10rpx;
		 display: flex;
		 justify-content: center;
		 align-items: center;
		 border: 2rpx solid #24bd9f;
		 border-radius: 6rpx;
		 color: #1c947a;
		 font-weight: 500;
		 
		 
	 }
	 .tb-tag-my{
	 	border-radius: 15rpx;
	 	font-size: 16rpx;
	 	margin-left: 5rpx;
	 }
	 .my-green{
		 color: #29c7a5;
	 }
	 .my-hui{
		 color: #585858;
		 font-size: 22rpx;
	 }
	 .flex {
	 	display: flex;
	 }
	 .justify-start {
	 	justify-content: flex-start;
	 }
	 
	 .justify-end {
	 	justify-content: flex-end;
	 }
	 .flex-column-center{
		 display: flex;
		 flex-direction: column;
		 justify-content: center;
		 align-items: center;
	 }
	 .flex-row-around{
	 		 display: flex;
	 		 flex-direction: row;
	 		 justify-content: space-around;
	 		 align-items: center;
	 }
	 .my-title{
		 font-size: 35rpx;
		 font-weight: bold;
	 }
	 .my-neirong{
		 font-size: 26rpx;
		 color: #6d6d6d;
	 }
	 .my-neirong-sm{
	 		 font-size: 23rpx;
	 		 color: #616161;
	 }
	 .my-tag-text{
		 font-size: 22rpx;
		 padding-top: 20rpx;
		 color: #bababa;
	 }
	 .padding-top{
		 padding-top: 35rpx;
	 }
	 .padding-top-sm{
	 	 padding-top: 20rpx;
	 }
	 .bottom-dh{
	 	background-color: #f1f1f1;
	 	position: fixed;
		z-index: 10;
	 	bottom: 0;
	 	width: 750rpx;
	 	height: 110rpx;
	 }
	 .tb-text{
	 	display: flex;
	 	flex-direction: column;
	 	justify-content: center;
	 	align-items: center;
	 }
	 .bottom-text{
		 width: 750rpx;
		 position: fixed;
		 text-align: center;
		 font-size: 26rpx;
		 color: #9d9d9d;
		 bottom: 70rpx;
	 }
	 .white-box{
	 		padding: 0 20rpx;
	 		margin-bottom: 15rpx;
	 		margin-top: 5rpx;
	 		width: 715rpx;
	 		background-color: #FFFFFF;
	 		border-radius: 30rpx;
	 	}
	.green-box{
			padding: 0 20rpx;
			margin-bottom: 15rpx;
			margin-top: 5rpx;
			width: 715rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			background-image: linear-gradient(#1faf97, #29c7a5);
		}
	.yuan-sm{
		width: 13rpx;
		height: 13rpx;
		border-radius: 50%;
		background-color: #1fc189;
		margin-left: 10rpx;
	}
	.yuan-normal{
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background-color: #159f3c;
		margin-left: 10rpx;
		
	}
	.yuan-normal-red{
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background-color: #bc3c11;
		margin-left: 10rpx;
		
	}
	.yuan-sm-red{
		width: 13rpx;
		height: 13rpx;
		border-radius: 50%;
		background-color: #de410d;
		margin-left: 10rpx;
	}
	.white-box-all{
		margin-top: 5rpx;
		width: 750rpx;
		background-color: #FFFFFF;
		border-radius: 13px;
	}
	 .moneycolor{
	 	color: #ea5002;
	 }
	 .text-bold-sm{
		 font-weight: 425;
	 }
	 .sm-moneycolor{
		 color: #e3793b;
	 }
	 .margin-top{
		 margin-top: 20rpx;
	 }
	 .margin-top-sm{
	 		 margin-top: 12rpx;
	 }
	 .margin{
		 margin: 20rpx;
	 }
	 .margin-left{
		 margin-left: 20rpx;
	 }
	 .margin-left-top{
		 margin-left: 20rpx;
		 margin-top: 20rpx;
	 }
	 .margin-right{
		 margin-right: 20rpx;
	 }
	 .my-absolute{
		 position: absolute;
	  }
	  .my-fixed{
	  		 position: fixed;
	  }
	 .my-seach{
		 width: 450rpx;
		 height: 55rpx;
		 background-color: #f8f8f8;
		 border-radius: 30rpx;
		 padding-left: 20rpx;
	 }
	 .move-view{
		 width: 48rpx;
		 height: 10rpx;
		 background-color: #28ba91;
		 border-radius: 4rpx;
		 margin-left: 100rpx;
	}
	.move-view-p{
		 width: 45rpx;
		 height: 10rpx;
		 background-color: #28ba91;
		 border-radius: 4rpx;
	}
	 .header-dh{
	 	position: fixed;
	 	padding-top: 20rpx;
		padding-bottom: 15rpx;
	 	height: 70rpx;
	 	width: 750rpx;
	 	background-color: #f1f1f1;
	 	z-index: 20;
	 }
	 .tp-normal{
		 width: 60rpx;
		 height: 60rpx;
	 }.tp-sm{
		 width: 45rpx;
		 height: 45rpx;
	 }.tp-big{
		 width: 70rpx;
		 height: 70rpx;
		 border-radius: 50%;
	 }

/* ==================
         聊天
 ==================== */

.cu-chat {
	display: flex;
	flex-direction: column;
}
.cu-chat .cu-item {
	display: flex;
	padding: 30rpx 30rpx 10rpx;
	position: relative;
}
.cu-chat .cu-item .avatar-wrapper {
	margin: 0;
	padding: 0;
	width: 80rpx;
	height: 80rpx;
}
.cu-chat .cu-item .avatar-wrapper::after {
	border: none;
}
.cu-chat .cu-item .cu-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.cu-chat .cu-item>.main {
	max-width: calc(100% - 260rpx);
	margin: 0 40rpx;
	display: flex;
	align-items: center;
}
.cu-chat .cu-item>.main .content {
	padding: 20rpx;
	border-radius: 6rpx;
	display: flex;
	flex-direction: column;
	max-width: 100%;
	align-items: left;
	font-size: 30rpx;
	position: relative;
	min-height: 40rpx;
	line-height: 40rpx;
	text-align: left;
	word-break: break-all;
}
.cu-chat .cu-item>.main .contentload {
	padding: 20rpx;
	border-radius: 6rpx;
	display: inline-flex;
	max-width: 100%;
	align-items: center;
	font-size: 30rpx;
	position: relative;
	min-height: 40rpx;
	line-height: 40rpx;
	text-align: left;
	word-break: break-all;
}
.cu-chat .cu-item>.main .content:not([class*="bg-"]) {
	background-color: #FFF;
	color: #000;
}
.cu-chat .cu-item>.main .contentload:not([class*="bg-"]) {
	background-color: #FFF;
	color: #000;
}
.cu-chat .cu-item .action {
	padding: 0 30rpx;
	display: flex;
	align-items: center;
}
.cu-chat .cu-item>.main .content::after {
	content: "";
	top: 27rpx;
	transform: rotate(45deg);
	position: absolute;
	z-index: 1;
	display: inline-block;
	overflow: hidden;
	width: 24rpx;
	height: 24rpx;
	left: -12rpx;
	right: initial;
	background-color: inherit;
}
.cu-chat .cu-item.self>.main .content::after {
	left: auto;
	right: -12rpx;
}
.cu-chat .cu-item>.main .content::before {
	content: "";
	top: 30rpx;
	transform: rotate(45deg);
	position: absolute;
	z-index: -1;
	display: inline-block;
	overflow: hidden;
	width: 24rpx;
	height: 24rpx;
	left: -12rpx;
	right: initial;
	background-color: inherit;
	filter: blur(5rpx);
	opacity: 0.3;
}
.cu-chat .cu-item>.main .content:not([class*="bg-"])::before {
	background-color: #000;
	opacity: 0.1;
}
.cu-chat .cu-item.self>.main .content::before {
	left: auto;
	right: -12rpx;
}
.cu-chat .cu-item.self {
	justify-content: flex-end;
	text-align: right;
}
.cu-chat .cu-info {
	display: inline-block;
	margin: 20rpx auto;
	font-size: 24rpx;
	padding: 8rpx 12rpx;
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 6rpx;
	color: #FFF;
	max-width: 400rpx;
	line-height: 1.4;
}
.bg-blue {
	background-color: #122d59;
	color: #FFF;
}
.bg-gray {
	background-color: #F0F0F0;
}
.bg-white {
	background-color: #FFF;
	color: #000;
}

.loading {
	width: 4px;
	height: 4px;
	border-radius: 2px;
	background: #666;
	float: left;
	margin: 0 3px;
	animation: loading linear 1s infinite;
	-webkit-animation: loading linear 1s infinite;
}
.loading:nth-child(1){
	animation-delay:0s;
}
.loading:nth-child(2){
	animation-delay:0.15s;
}
.loading:nth-child(3){
	animation-delay:0.3s;
}
@keyframes loading 
{
	0%,60%,100% {transform: scale(1);}
	30% {transform: scale(2.5);}
}
@-webkit-keyframes loading 
{
	0%,60%,100% {transform: scale(1);}
	30% {transform: scale(2.5);}
}

.line{
  float:right;
  width: 100%;
  height: 1px;
  margin-top: 30rpx;
  background:#f3f3f3;
  position: relative;
  text-align: center;
}

.content_button_view {
	width: 100%;
	display: flex;
	flex-direction: row;
	text-align: center;
}
.content_button {
	font-size: 28rpx;
	color: #989c9c;
	background-color: #FFF;
}
.content_button::after {
	border: none;
}

.timeout_tip {
	text-align: center;
	font-size: 22rpx;
	line-height: 45rpx;
	color: #A5A5A5;
	background-color: #F0F0F0;
	width: 430rpx;
	margin: 10rpx auto 0rpx auto;
	border-radius: 20rpx;
	position: relative;
}
</style>