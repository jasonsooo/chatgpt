<template>
	<tabbar pagePath="pages/my/my"></tabbar>
    <view class="body">
		<checkIn ref="checkIn"></checkIn>
		<view class="user-section">
			<view class="user-info-box">
<!-- 				//#ifdef H5
				<button class="portrait-box">
				//#endif
				//#ifdef MP-WEIXIN
				<button class="portrait-box" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				//#endif
				//#ifdef MP-TOUTIAO
				<button class="portrait-box" data-eventsync="true"  @tap="onChooseAvatar">
				//#endif
					<image class="portrait" :src="userInfo.user_avatar" data-eventsync="true" mode="aspectFill"></image>
				</button> -->
				<view class="info-box">
					<view class="info-name">
						<text class="username" :class="{active:userInfo.is_vip}">{{userInfo.user_name}}</text>
						<image v-if="userInfo.is_vip" class="vip-img" src="/static/images/vip.png" mode="" @click="$u.route('/pages/my/vip')"></image>
					</view>
					<view class="vip_tip">{{userInfo.is_vip?'您已是会员将不再消耗积分':'开通会员畅玩AI'}}</view>
				</view>
				<view v-if="!userInfo.is_vip && config.is_buy_vip" class="vip-box" @click="$u.route('/pages/my/vip')">
					开通VIP
				</view>
				<view v-if="userInfo.is_vip" class="vip-expires" @click="$u.route('/pages/my/vip')">
					{{userInfo.vip_expires_time}} 到期
				</view>
			</view>
		</view>
		
		<view class="cover-container">
			<!-- 积分 -->
			<view class="tj-sction">
				<view class="tit">积分统计</view>
				<view class="tj-content">
					<view class="tj-item">
						<text class="num">{{userInfo.points}}</text>
						<text>剩余积分</text>
					</view>
					<view class="tj-item">
						<text class="num">{{today_data.use_points}}</text>
						<text>今日使用</text>
					</view>
					
					<view class="tj-item">
						<text class="num">{{today_data.get_points}}</text>
						<text>今日获得</text>
					</view>
				</view>
			</view>
			<!-- 功能列表 -->
			<view class="function-section">
				<uni-list-item title="每日签到" showArrow :show-extra-icon="true" :extra-icon="{color: '#0F2E58',size: '45rpx', customPrefix: 'iconfont', type: 'icon-icon_commone_qiandaomian'}" rightText="免费领积分" :border="false" :clickable="true" @click="$refs.checkIn.show();" />
				<uni-list-item title="隐私协议与使用条款" showArrow :show-extra-icon="true" :extra-icon="{color: '#0F2E58',size: '45rpx', customPrefix: 'iconfont', type: 'icon-Rrl_s_079'}" :clickable="true" to="/pages/my/disclaimer" />
			</view>
		</view>
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
			this.weixinAd.onLoad(() => {}); // 加载广告
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
			weekdays: [1, 2, 3, 4, 5, 6, 7],
		}
	},
	methods: {
		openCustomerServiceChat() {
			wx.openCustomerServiceChat({
			  extInfo: {url: ''},
			  corpId: '',
			  success(res) {}
			})
		}
	}
}
</script>

<style lang='scss'>
page {
	background: #f5f5f5;
}
%flex-center {
	display:flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	display:flex;
	justify-content: space-around;
	align-content: center;
	background: #fff;
	border-radius: 25upx;
}

.user-section{
	height: 100upx;
	padding: 70upx 30upx 5upx 30upx;
	position:relative;
}
.user-info-box{
	height: 50upx;
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
	.portrait-box {
		margin: 0;
		padding: 0;
		width: 100upx;
		height: 100upx;
		background: none;
	}
	.portrait-box::after {
		border: none;
	}
	.portrait{
		width: 90upx;
		height: 90upx;
		border: 5upx solid #fff;
		border-radius: 50%;
	}
	.info-box {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.info-name {
		display: flex;
		flex-direction: row;
	}
	.username {
		font-size: 35upx;
		color: #000;
		margin-left: 20upx;
		font-weight: bold;
	}
	.username.active {
		color: #F19F2C;
	}
	.vip_tip {
		font-size: 25upx;
		margin: 5upx 0 0 20upx;
		color: #929292;
	}
	.vip-img {
		width: 40upx;
		height:40upx;
		margin: 3upx 0 0 20upx;
	}
	.vip-box {
		background-color: #F19F2C;
		width: 160rpx;
		display: flex;
		justify-content: center;
		padding: 10rpx 0;
		font-size: 30rpx;
		border-radius: 15rpx;
	}
	.vip-expires {
		font-size: 25upx;
		color: #6B6B6B;
		margin-top: 54upx;
	}
}

.cover-container{
	margin-top: -10upx;
	padding: 0 30upx;
	position:relative;
	padding-bottom: 20upx;
}
.tj-sction{
	@extend %section;
	flex-direction: column;
	background-color: #0F2E58;
	.tit {
	color: #FFF;
    font-size: 30upx;
    padding: 30upx 0 0 40upx;
	}
	.tj-content{
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: space-around;
		margin: 0 0 15upx 0;
	}
	.tj-item{
		@extend %flex-center;
		flex-direction: column;
		height: 140upx;
		font-size: 27upx;
		color: #A1A1A1;
	}
	.num{
		font-weight: bold;
		font-size: 39upx;
		color: #F8C480;
		margin-bottom: 8upx;
	}
}

.function-section{
	padding: 30upx 0 0;
	margin-top: 20upx;
	background: #fff;
	border-radius:25upx;
}

.list-item-contact-btn {
	padding: 0;
	margin: 0;
	border-radius: 0;
	background-color: #fff;
	line-height: 1;
	text-align: left;
}
.list-item-contact-btn::after {
	border: none;
}
</style>