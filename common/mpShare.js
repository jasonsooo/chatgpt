export default {
    onShareAppMessage(res) {
		if (res.from === 'button') { // 分享来自按钮
			return {
				title: '写方案，作说明，学知识，无所不知的超级人工智能！', // 默认为小程序名称
				path: '/pages/index/index?pid=' + this.userInfo.id, // 默认为当前页面路径
				imageUrl: '' // 默认为当前页面的截图
			}
		} else {
			return {
				title: '写方案，作说明，学知识，无所不知的超级人工智能！',
				path: '/pages/index/index?pid=' + this.userInfo.id,
				imageUrl: '/static/images/shareImg.png'
			}
		}
    },
	onShareTimeline() { // 分享到朋友圈
		return {
			title: '明智AI--媲美钢铁侠助理的超级人工助理',
			query: 'pid=' + this.userInfo.id,
			imageUrl: '/static/images/shareImg.png'
		}
	},
}