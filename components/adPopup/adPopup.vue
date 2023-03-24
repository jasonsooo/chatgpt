<template>
	<view class="adPopup" v-if="isMask">
		<view class="mask" @click="close"></view>
		<view>
			<view class="adbox">
				<view class="tip_title">{{title}}</view>
				<view class="tip_content">您可以选择以下方式增加积分</view>
				<u-line margin="20rpx 0"></u-line>
				<view v-if="config.is_buy_vip" class="vip-box" @click="navTo('/pages/my/vip')">
					<image class="vip-img" src="/static/images/vip.png" mode="" ></image>
					<view class="vip-content">
						<view class="vip-title">升级成为会员</view>
						<u-line color="#2E69A3" margin="5rpx 0"></u-line>
						<view class="vip-tip">无需积分 高速通道</view>
					</view>
					<view class="vip-price">
						<view class="vip-tag">限时折扣</view>
						<view class="vip-amount">¥0.51/天</view>
					</view>
				</view>
				<view class="btn_row">
					<uni-badge :text="`+${this.config.user_points.rewarded_points}分`" type="success" absolute="rightTop" :offset="[17,4]" size="small">
						<button :disabled="isAd" class="btn" @click="adClick" :style="{'background-color':adBtnColor}">
							<view class="btn_icon"><uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="35rpx" :color="adIconColor"></uni-icons></view>
							<text>观看广告({{this.config.user_points.rewarded_num - this.userInfo.today_rewarded_num}}/{{this.config.user_points.rewarded_num}})</text>
						</button>
					</uni-badge>
					<uni-badge :text="`+${this.config.user_points.share_points}分`" type="primary" absolute="rightTop" :offset="[17, 4]" size="small">
						<button :disabled="isShare" class="btn" open-type="share" @click="shareClick" :style="{'background-color':shareBtnColor}">
							<view class="btn_icon"><uni-icons custom-prefix="iconfont" type="icon-fenxiangfangshi" size="35rpx" :color="shareIconColor"></uni-icons></view>
							<text>分享({{this.config.user_points.share_num - this.userInfo.today_share_num}}/{{this.config.user_points.share_num}})</text>
						</button>
					</uni-badge>
				</view>
				<view class="close" @click="close"><icon type="clear" size="26"/></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: "剩余积分已用完"
		},
		text: {
			type: String,
			default: ""
		}
	},
	data () {
		return {
			isShare: false,
			isAd: false,
			isMask: false,
			adBtnColor: "#D2FFC9",
			adIconColor: "#30941C",
			shareBtnColor: "#CEE7FF",
			shareIconColor: "#1A64B6",
		}
	},
	methods:{
		navTo(url){
			uni.navigateTo({  
				url
			})  
		}, 
		adClick() {
			if (this.userInfo.today_rewarded_num < this.config.user_points.rewarded_num) {
				this.$setVal({key: "adRewardClickType",value: "rewarded"})
				this.$parent.showAd()
			}
		},
		shareClick() {
			if (this.userInfo.today_share_num < this.config.user_points.share_num) {
				this.$setVal({key: "hasShare",value: {status: true, time: Math.round(new Date().getTime()/1000).toString()}})
				this.isMask = false
			}
		},
		show() {
			if (this.userInfo.today_rewarded_num >= this.config.user_points.rewarded_num) {
				this.deAdBtn()
			} else {
				this.enAdBtn()
			}
			
			if (this.userInfo.today_share_num >= this.config.user_points.share_num) {
				this.deShareBtn()
			} else {
				this.enShareBtn()
			}
			this.isMask = true
		},
		close() {
			this.isMask = false
		},
		enAdBtn() {
			this.isAd = false
			this.adBtnColor = "#D2FFC9"
			this.adIconColor = "#30941C"
		},
		deAdBtn() {
			this.isAd = true
			this.adBtnColor = "#F0F0F0"
			this.adIconColor = "#ADADAD"
		},
		enShareBtn() {
			this.isShare = false
			this.shareBtnColor = "#CEE7FF"
			this.shareIconColor = "#1A64B6"
		},
		deShareBtn() {
			this.isShare = true
			this.shareBtnColor = "#F0F0F0"
			this.shareIconColor = "#ADADAD"
		}
	}
}
</script>

<style lang="scss">
.adPopup {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index:1999;
}
.mask{
	position: fixed;
	top: 0;
	left:0;
	width: 100%;
	height: 100%;
	z-index:1888;
	background-color: rgba(0, 0, 0, 0.6);
}

.hidden {
	display: none;
}

.adbox{
	position: absolute;
	top:20%;
	z-index: 1998;
	width:90%;
	left:5%;
	background-color: #fff;
	border-radius:30rpx;
	padding:30rpx 0rpx;
	.close {
		position: absolute;
		top:20rpx;
		right:20rpx;
		z-index: 1999;
		text-align: center;
	}
	.tip_title {
		padding: 5rpx 20rpx;
		text-align: center;
		font-size: 35rpx;
		color: #333;
		font-weight: bold;
	}
	.tip_content {
		padding: 0rpx 20rpx;
		text-align: center;
		font-size: 25rpx;
		color: #9a9ca0;
	}
	.btn_row {
		display: flex;
		flex-direction: row;
		text-align: center;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 40upx 0 0 0;
	}
	.btn {
		width: 300upx;
		margin:0 15upx 0 15upx;
		padding:20upx 0;
		text-align:center;
		border-radius: 34px;
		font-size: 30upx;
		font-weight: bold;
		line-height: 50upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		color: #333;
	}
	.btn::after {
		border: none;
	}
	.btn_icon {
		margin-right: 10rpx;
	}
}

.vip-box {
	background-color: #4283C4;
	height: 150upx;
	border-radius: 25upx;
	margin: 0 30upx;
	display: flex;
	flex-direction: row;
	align-items: center;
	.vip-img {
		width: 85upx;
		height: 85upx;
		margin: 0 20rpx 0 30rpx;
	}
	.vip-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin: 0 20rpx;
	}
	.vip-title {
		color: #FFF;
		font-size: 36upx;
	}
	.vip-tip {
		color: #FFF;
		font-size: 30upx;
	}
	.vip-price {
		display: flex;
		flex-direction: column;
		margin: 0 30rpx 0 20rpx;
	}
	.vip-tag {
		background-color: #E0AF6C;
		font-size: 25rpx;
		color: #FFF;
		width: 120rpx;
		padding: 5rpx 0;
		text-align: center;
	}
	.vip-amount {
		color: #E2C834;
		font-size: 35upx;
	}
}
</style>