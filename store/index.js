import { createStore } from 'vuex'

export default createStore({
	state: {
		config: {}, // 配置信息
		platform: "", // 运行平台
		today_data: { // 今日数据
			use_points: 0, // 使用积分
			get_points: 0 // 获取积分
		},
		hasLogin: false, // 登陆状态
		hasCheckIn: { // 签到状态
			common: false,
			video: false
		},
		userInfo: {
			user_name: "游客",
			points: 0,
		}, // 用户信息
		msgAllList: {}, // 所有对话记录
		hasShare: { // 分享状态
			status: false,
			time: 0
		}, 
		adConfig: { // 广告配置
			weiXinRewardedAdId: "xxxxxx", // 微信激励广告ID
            douYinRewardedAdId: "xxxxxx", // 抖音激励广告ID
			weiXinBannerAdId: "xxxxxx", // 微信Banner广告ID
			douYinBannerAdId: "xxxxxx" // 抖音Banner广告ID
		},
		adRewardClickType: "" // 激励广告点击类型
	},
	mutations: {
		$setVal(state, data) {
			state[data.key] = data.value
		},
		login(state, data) {
			state.hasLogin = true
			state.userInfo = data
			
			if (data.checkin_date == data.reset_date) { // 今日是否普通签到
				state.hasCheckIn.common = true
			} else {
				state.hasCheckIn.common = false
			}
			if (data.checkin_video_date == data.reset_date) { // 今日是否完成视频签到
				state.hasCheckIn.video = true
			} else {
				state.hasCheckIn.video = false
			}
			
			uni.setStorage({
				key: "userInfo",
				data: data
			})
		},
		pointsPlus(state, data) { // 增加积分
			if (data.type == 'checkin_common') { // 普通签到
				state.userInfo.checkin_day = data.checkin_day
				state.hasCheckIn.common = true
			} else if (data.type == 'checkin_video') { // 视频签到
				state.hasCheckIn.common = true
				state.hasCheckIn.video = true
			} else {
				state.userInfo["today_"+data.type+"_num"] += 1
			}
			state.userInfo.points += parseInt(data.plus_points)
			
			state.today_data.get_points += parseInt(data.plus_points)
			uni.setStorage({
			    key: "today_data",
			    data: state.today_data
			})
		},
		pointsSub(state, data) { // 减少积分
			state.userInfo.points -= parseInt(data.sub_points)
			
			state.today_data.use_points += parseInt(data.sub_points)
			uni.setStorage({
			    key: "today_data",
			    data: state.today_data
			})
		},
	},
	actions: {
		
	}
})