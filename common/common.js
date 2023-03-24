import {mapState,mapMutations} from 'vuex'

export default {
	computed: {
		...mapState([
			'config', // 配置信息
			'platform', // 运行平台
			'hasLogin', // 登陆状态
			'hasCheckIn', // 签到状态
			'userInfo', // 用户信息
			'hasShare', // 分享状态
			'adConfig', // 广告配置
			'adRewardClickType', // 激励广告点击类型
			'today_data', // 今日数据
		])
	},
	onShow() {
		if (this.hasLogin) {
			this.init();
		}
		
		if (this.hasShare.status) { // 显示页面时判断是否点击了分享按钮
			//#ifdef MP-WEIXIN
			if (Math.round(new Date().getTime()/1000).toString() - this.hasShare.time >= 2) { // 点击分享3秒后返回页面算有效
				this.$wiseApi.pointsPlus({type: "share"}); // 增加积分
			} else {
				uni.showToast({
					icon: 'none',
					title: '分享失败不增加积分'
				});
			}
			//#endif
			//#ifdef MP-TOUTIAO
				this.$wiseApi.pointsPlus({type: "share"}); // 增加积分
			//#endif
			this.$setVal({key: "hasShare",value: {status: false, time: 0}})
		}
	},
	methods: {
		...mapMutations([
			'$setVal'
		]),
		init() { // 初始化
			let reset_date = uni.getStorageSync('reset_date');
			if (reset_date !== this.userInfo.reset_date) {
				this.$wiseApi.getConfig(); // 获取配置
				this.updateUserInfo(); // 重新获取用户数据进行重置
				
				this.$setVal({
					key: "today_data",
					value: {
						use_points: 0,
						get_points: 0
					}
				})
				
				uni.setStorage({
					key: "reset_date",
					data: this.userInfo.reset_date
				})
			}
		},
		updateUserInfo() { // 更新用户数据
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo){
				this.$wiseApi.getUserInfo(userInfo);
			} else {
				let that = this
				wx.login({
					success (res) {
						if (res.code) {
							that.$wiseApi.login({code: res.code, pid: that.getLocationParams("pid")})
						} else {
							console.log('微信小程序登录失败: ' + res.errMsg)
						}
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '登陆失败，请检查网络'
						});
					}
				})
			}
		},
		/**
		 * px转rpx
		 * @param {Object} px
		 */
		pxTorpx(px) {
			let deviceWidth = uni.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
			let rpx = (750 / deviceWidth) * Number(px)
			return Math.floor(rpx);
		},
		getLocationParams(name) { // 获取参数
			const pages = getCurrentPages();
			// 获取路由参数
			const curPage = pages[pages.length - 1];
			
			if (name) {
				//#ifndef H5
				let params = curPage.options[name]
				//#endif
				//#ifdef H5
				let params = curPage.$page.options[name]
				//#endif
				
				//#ifdef MP-WEIXIN
				if (!params) {
					params = curPage.options["scene"]
					if (params) {
						params = decodeURIComponent(params).replace('?', '&')
						let paramsArr = params.split('&')
						paramsArr = paramsArr.filter(item => item)
						let result = {}
						paramsArr.filter(item => {
							const key = item.split('=')
							result[key[0]] = key[1]
						})
						params = result[name]
					}
				}
				//#endif
				
				return params
			} else {
				//#ifndef H5
				return curPage.options;
				//#endif
				//#ifdef H5
				return curPage.$page.options
				//#endif
			}
		},
	}
}