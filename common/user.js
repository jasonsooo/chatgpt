export default {
	methods: {
		onChooseAvatar(e) { // 选择头像
			//#ifdef MP-WEIXIN
			this.userInfo.user_avatar = e.detail.avatarUrl
			uni.setStorageSync('userInfo', this.userInfo);
			//#endif
			
			//#ifdef MP-TOUTIAO
			let that = this
			tt.getUserProfile({ // 抖音保存头像
				success(res) {
					this.userInfo.user_avatar = res.userInfo.avatarUrl
					uni.setStorageSync('userInfo', this.userInfo);
				},
				fail(res) {
				},
			});
			//#endif
		},
	}
}