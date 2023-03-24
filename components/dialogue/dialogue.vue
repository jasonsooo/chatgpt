<template>
	<view>
		<uni-fab ref="fab" :pattern="fabPattern" :content="fabContent" horizontal="right" vertical="top" direction="vertical" @trigger="trigger"/>
		<uni-drawer ref="drawerLeft" mode="left" :width="250">
			<scroll-view style="height: 100%;" scroll-y="true">
				<uni-section title="历史对话">
					<uni-list v-for="(x,i) in chatList" :key="i">
						<uni-list-item showArrow :title="x.title" thumb="/static/images/dialogue2.png" thumb-size="sm">
							<template v-slot:body>
								<view class="drawerItemTitle" @click="clickChat(x.index)"><text>{{x.title}}</text></view>
							</template>
							<template v-slot:footer>
								<uni-icons @click="delChat(i,x.index)" custom-prefix="iconfont" type="icon-del" size="35rpx" color="#cbcbcb"></uni-icons>
							</template>
						</uni-list-item>
					</uni-list>
				</uni-section>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
import {mapState} from 'vuex'

export default {
	computed: {
		...mapState([
			'msgAllList', // 所有对话记录
		])
	},
	data() {
		return {
			fabPattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#7A7E83',
				buttonColor: '#fff',
				iconColor: '#aaa'
			},
			fabContent: [
				{
					iconPath: '/static/images/newChat.png',
					selectedIconPath: '/static/images/newChat.png',
					text: '新建',
					active: false
				},
				{
					iconPath: '/static/images/dialogue.png',
					selectedIconPath: '/static/images/dialogue.png',
					text: '对话',
					active: false
				},
				{
					iconPath: '/static/images/adver.png',
					selectedIconPath: '/static/images/adver.png',
					text: '会员',
					active: false
				}
			],
			chatList: []
		}
	},
	methods: {
		trigger(e) {
			if (e.index === 0) { // 新建
				uni.redirectTo({
					url:'../chat/chat',
				})
			} else if (e.index === 1) { // 对话
				let chatList = []
				for (let key in this.msgAllList) {
					chatList.push({
						title: this.msgAllList[key][1].msg,
						index: key
					})
				}
				this.chatList = chatList
				this.$refs['drawerLeft'].open()
			} else if (e.index === 2) { // 会员
				if (this.config.is_buy_vip) {
					uni.navigateTo({
						url: '/pages/my/vip'
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '暂未开放'
					});
				}
			}
		},
		clickChat(index) {
			this.$refs['drawerLeft'].close()
			uni.redirectTo({
				url:'../chat/chat?msgAllListIndex='+index,
			})
		},
		delChat(i,index) {
			this.chatList.splice(i, 1);
			delete this.msgAllList[index]
			uni.setStorage({
				key: 'msgAllList',
				data: JSON.stringify(this.msgAllList)
			});
		}
	}
}
</script>

<style>
.drawerItemTitle {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>