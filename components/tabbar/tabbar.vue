<template>
    <view class="tabbar_pages">
        <view class="uni-tabbar">
            <view class="tababr_item tabbar_find" v-for="(item,index) in tabbarList" :key="index" @click="tabbarSave(item,index)">
                <view class="tabbar_icon" v-if="item.type == 0">
					<image :src="item.icon_select" class="icon_image select_img" mode="" v-if="item.pagePath == pagePath"></image>
					<image :src="item.icon" class="icon_image" mode="" v-else></image>
                </view>
                <view class="find_icon" v-if="item.type == 1">
					<view class="icon">
						<image :src="item.icon_select" class="icon_image select_img" mode="" v-if="item.pagePath == pagePath"></image>
						<image :src="item.icon" class="icon_image" mode="" v-else></image>
					</view>
                </view>
                <view class="tababr_text" :class="item.pagePath == pagePath?'textActive':''">{{item.text}}</view>
                <view class="tag" v-if="isShowNums && item.nums > 0">{{item.nums}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
	props: { 
		isShowNums: {
			default: true,
			type: Boolean
		},
		pagePath:{
			default:'',
			type:String
		}
	},
	data() {
		return {
			page: '',
			isRouterShow: true,
			tabbarList: [{
					"pagePath": "pages/index/index",
					"text": "首页",
					"icon_select": "/static/images/home_select.png",
					"icon": "/static/images/home.png",
					"type": 0,
					"nums": 0
				},
/*                    {
					"pagePath": "pages/commu/index",
					"text": "问答",
					"icon_select": "../../static/tabbar/select_sq.png",
					"icon": "../../static/tabbar/sq.png",
					"type": 0,
					"nums": 0
				}, */
				{
					"pagePath": "pages/chat/history_dialogue",
					"text": "历史对话",
					"icon": "/static/images/history_dialogue_select.png",
					"icon_select": "/static/images/history_dialogue_select.png",
					"type": 1,
					"nums": 0
				},
/*                    {
					"pagePath": "pages/news/index",
					"text": "对话",
					"icon_select": "../../static/tabbar/select_news.png",
					"icon": "../../static/tabbar/news.png",
					"type": 0,
					"nums": 9
				}, */
				{
					"pagePath": "pages/my/my",
					"text": "我的",
					"icon_select": "/static/images/me_select.png",
					"icon": "/static/images/me.png",
					"type": 0,
					"nums": 0
				}
			]
		};
	},
	created() { 
		uni.hideTabBar();
		//您的判断逻辑isRouterShow
		if (this.isRouterShow == false) { 
			this.tabbarList.splice(2,1)
			uni.setTabBarItem({
				index: 1, // tabBar 的哪一项，从左边算起
				visible: false // 该项是否显示
			})
		}
	},
	methods: {
		tabbarSave(e, index) {
			this.page = e.pagePath

			/* if (e.type == 1) {
				uni.navigateTo({
					url: '/' + e.pagePath
				});
			} else { */
				uni.switchTab({
					url: '/' + e.pagePath
				});
			/* } */
		},
	}
}
</script>

<style lang="scss">
.uni-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	display: flex;
	justify-content: space-around;
	height: 100upx;
	height: calc(100upx + env(safe-area-inset-bottom)) !important;
	padding-bottom: calc(env(safe-area-inset-bottom)) !important;
	box-sizing: border-box;
	background-color: #fff;
	box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);

	.tabbar_find {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.find_icon {
			width: 60px;
			height: 55px;
			margin-top: -30px;
			background-color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			box-shadow: 0px 0px -17rpx 1rpx rgba(206, 206, 206, 0.32);

			.icon {
				background-color: #122d59;
				width: 42px;
				height: 42px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				.icon_image {
					width: 28px;
					height: 28px;
				}

				.select_img {
					animation: tabbar-item-button-click 0.2s forwards 1 !important;
				}
			}
		}
	}

	.tababr_item {
		font-size: 20rpx;
		text-align: center;
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;

		.tag {
			position: absolute;
			right: 20px;
			top: 5px;
			padding: 4rpx;
			width: 12px;
			height: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: red;
			font-size: 24rpx;
			border-radius: 50%;
			color: #fff;
		}

		.tabbar_icon {
			height: 25px;
			width: 25px;

			.select_img {
				animation: tabbar-item-button-click 0.2s forwards 1;
			}

			.icon_image {
				width: 100%;
				height: 100%;
			}
		}

		.tababr_text {
			line-height: 24rpx;
			font-size: 24rpx;
			margin-top: 2px;
			color: #999;
		}
		.textActive{
			color: #122d59;
		}
	}
}

/* 点击动画 start */
@keyframes tabbar-item-button-click {
	from {
		transform: scale(0.5);
	}
	to {
		transform: scale(1);
	}
}
</style>