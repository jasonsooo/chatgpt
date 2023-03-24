<script>
	import {mapMutations} from 'vuex';
	export default {
		onLaunch: function() {
			let that = this
			
			uni.getSystemInfo({
				success: function (res) {
					let platform = ""
					switch (res.uniPlatform) {
						case "mp-weixin":
							platform = "weixin"
							break;
						case "mp-douyin":
							platform = "douyin"
							break;
					}
					that.$setVal({key: "platform", value: platform})
				}
			});
			
			that.$wiseApi.getConfig(); // 获取配置
			this.updateUserInfo(); // 更新用户数据
			
			let today_data = uni.getStorageSync("today_data");
			if(today_data){
				this.$setVal({key: "today_data",value: today_data});
			}
			
			let msgAllList = uni.getStorageSync("msgAllList");
			if(msgAllList){
				this.$setVal({key: "msgAllList",value: JSON.parse(msgAllList)});
			}
		},
		onShow: function() {
		},
		onHide: function() {
		},
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";
	@import "@/static/css/iconfont.css";
</style>