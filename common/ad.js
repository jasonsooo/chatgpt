export default {
	methods: {
		showAd() {
			//#ifdef MP-WEIXIN
			this.weixinAd.show().catch(() => {
				// 失败重试
				this.weixinAd.load()
					.then(() => this.weixinAd.show())
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: '广告加载失败'
						});
					})
			})
			//#endif
			
			//#ifdef MP-TOUTIAO
			let that = this
			tt.getSystemInfo({
				success(res) {
					switch (res.appName) {
						case "Toutiao":
						case "news_article_lite":
							uni.showToast({
								icon: 'none',
								title: '头条暂不支持'
							});
							break;
						default:
							tt.showLoading();
							that.douyinAd.show();
							break;
					}
				}
			});
			//#endif
		},
		onadload(e) { // 广告数据加载成功
			
		},
		onadclose(e) { // 用户点击了【关闭广告】按钮
			if (e.isEnded) {
				switch (this.adRewardClickType) {
					case 'rewarded': // 激励视频
						this.$wiseApi.pointsPlus({type: "rewarded"}); // 增加积分
						this.$refs.adPopup.close(); // 关闭弹框
						break;
					case 'checkin_video': // 视频签到
						this.$wiseApi.checkIn({type: "video"});
						break;
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '中途退出不增加积分'
				});
			}
			
			//#ifdef MP-TOUTIAO
			tt.hideLoading();
			//#endif

			this.$setVal({key: "adRewardClickType", value: ""});
		},
		onaderror(e) { // 广告加载失败		
			//#ifdef MP-TOUTIAO
			tt.hideLoading();
			switch (e.errCode) {
				case 1004:
					// 无合适的广告
					break;
				default:
				// 更多请参考错误码文档
			}
			//#endif

		},
	}
}