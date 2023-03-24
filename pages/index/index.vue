<template>
	<tabbar pagePath="pages/index/index"></tabbar>
	<view class="body">
		<adPopup ref="adPopup" :text="`需要我做些什么？(剩余积分: ${this.userInfo.points})`"></adPopup>
		<view class="logo">
			<image src="/static/images/logo.png"></image>
		</view>
		<view class="tip">
			您的超级人工智能私人助理
		</view>
		<view class="search">
			<input v-model="msg" class="search_input" type="text" @confirm="sendMsg" confirm-type="search" placeholder-class="search_input_placehold" placeholder="需要我做些什么？" :adjust-position="false" />
			<view>
				<button @click="sendMsg" :disabled="msgLoad" class="search_button"><image src="/static/images/send.png" style="width: 30rpx; height: 30rpx;"></image></button>
			</view>
		</view>
		<view class="case">
			<view class="case_title">
				<text>我能做些什么</text>
			</view>
			<view class="case_row">
				<view class="case_content">
					<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-wenda" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">问答计算</text>
						</view>
					</view>
					<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-fanyi" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">文本翻译</text>
						</view>
					</view>
	<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-xiezuozhidao" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">创意写作</text>
						</view>
					</view>
				</view>
				<view class="case_content">
					<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-wenjian" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">文案创作</text>
						</view>
					</view>
					<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-falv" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">法律咨询</text>
						</view>
					</view>
	<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-shujukanban" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">数据分析</text>
						</view>
					</view>
				</view>
				<view class="case_content">
					<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-tianjiawengao" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">论文助手</text>
						</view>
					</view>
					<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-daimaguanli" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">代码辅助</text>
						</view>
					</view>
	<view class="case_item">
						<view class="case_item_icon"><uni-icons custom-prefix="iconfont" type="icon-tuwenbaogao" size="80rpx" color="#282828"></uni-icons></view>
						<view class="case_item_content">
							<text class="case_item_content_title">文本摘要</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="more">更多功能等你发现</view>
		<!-- <view class="guide"><uni-icons type="help" color="#868686"></uni-icons>使用指南</view> -->
	</view>
</template>

<script>
export default {
	onLoad() {
		// 微信激励广告
		//#ifdef MP-WEIXIN
		if (wx.createRewardedVideoAd) {
			this.weixinAd = wx.createRewardedVideoAd({
				adUnitId: this.adConfig.weiXinRewardedAdId,
			});
			try{
				if (this.weixinAd.closeHandler) {
					this.weixinAd.offClose(this.weixinAd.closeHandler);
				}
			} catch (e) {
				console.log("weixinAd.offClose 卸载失败");
				console.error(e);
			}
			this.weixinAd.onLoad(); // 加载广告
			this.weixinAd.onError((err) => {
				this.onaderror(err)
			});
			this.weixinAd.onClose((data) => { // 监听视频播放
				this.onadclose(data)
			});
		}
		//#endif
		
		// 抖音激励广告
		//#ifdef MP-TOUTIAO
		this.douyinAd = tt.createRewardedVideoAd({
			adUnitId: this.adConfig.douYinRewardedAdId,
		});
		try{
			if (this.douyinAd.closeHandler) {
				this.douyinAd.offClose(this.douyinAd.closeHandler);
			}
		} catch (e) {
			console.log("douyinAd.offClose 卸载失败");
			console.error(e);
		}
		this.douyinAd.onError((err) => {
			this.onaderror(err)
		});
		this.douyinAd.onClose((data) => { // 监听视频播放
			this.onadclose(data)
		});
		this.douyinAd.load(); // 预加载广告
		//#endif
	},
	data() {
		return {
			msgLoad: false,
			msg: ""
		}
	},
	methods: {
		sendMsg() {
			// 消息为空不做任何操作
			if (this.msg == "" || this.msgLoad) {
				return 0
			}
		
			if (this.msg.length < 2) {
				uni.showToast({
					icon: 'none',
					title: '请至少输入2个字'
				});
				return 0;
			}
		
			this.msgLoad = true
			if (this.userInfo.is_vip == 0 && this.userInfo.points <= 0) { // 积分已用完
				this.$refs.adPopup.show();
				this.msgLoad = false
				return 0
			}
			
			uni.setStorage({
				key: 'msg',
				data: this.msg
			});
			
			this.msg = "" // 清除消息
			uni.redirectTo({
				url:'../chat/chat',
			})
			this.msgLoad = false
		}
	}
}
</script>

<style>
page {background-color:#FFF;}

.body {
	width: 100%;
	height: 100%;
	background-color: #FFF;
}

.logo {
	width: 100%;
	text-align: center;
	margin-top: 50rpx;
}
.logo image {
	width: 160upx;
	height: 196upx;
}

.tip {
	width: 100%;
	color: #494949;
	text-align: center;
	font-weight: bold;
	font-size: 40rpx;
	margin-top: 30upx;
}

.search {
	margin-top: 50rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.search_input {
	width: 535rpx;
	height: 100rpx;
	background-color: #F9F8FD;
	border-radius: 50rpx;
	border-top-right-radius: 0rpx;
	border-bottom-right-radius: 0rpx;
	padding-left: 50rpx;
	padding-right: 60rpx;
	font-size: 30rpx;
	position:relative;
	left:25rpx;
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
	position:relative;
	right:25rpx;
	background-color: #122d59;
}
.search_button::after {
	border: none;
}

.case {
	width: 660rpx;
	height: auto;
	text-align: center;
	border-radius: 15px;
	margin: 50rpx auto 0 auto;
	padding: 0 20rpx 10rpx 20rpx;
}
.case_title {
	font-weight: bold;
	font-size: 35rpx;
	line-height: 100rpx;
}
.case_row {
	display: flex;
	flex-direction: row;
}
.case_content {
	display: flex;
	flex-direction: column;
	background-color: #F9F8FD;
	border-radius: 30rpx;
	width: 180rpx;
	margin: 0rpx 20rpx;
}
.case_item {
	margin: 20rpx 0;
	padding: 15rpx 15rpx;
	display: flex;
	flex-direction: column;
}
.case_item_icon {
	display: flex;
	align-items: center;
	justify-content: center;
}
.case_item_content {
	display: flex;
	flex-direction: column;
	text-align: center;
}
.case_item_content_title {
	margin-top: 10rpx;
	font-weight: bold;
	font-size: 30rpx;
	color: #282828;
}

.more {
	width: 100%;
	height: 200upx;
	text-align: center;
	font-size: 25rpx;
	line-height:25rpx;
	color: #868686;
	margin-top: 30rpx;
}

.guide {
	width: 100%;
	height: 150rpx;
	text-align: center;
	font-size: 30rpx;
	line-height: 30rpx;
	color: #868686;
}
</style>