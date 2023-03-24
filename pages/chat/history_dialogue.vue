<template>
	<tabbar pagePath="pages/chat/history_dialogue"></tabbar>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in historyList" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']" :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in historyList" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view v-if="item.dataList.length == 0" class="emptyTip">
						<u-empty mode="history" text="无历史对话" icon="/static/images/empty_history.png"></u-empty>
					</view>
					<view v-else class="page-view">
						<u-swipe-action>
							<uni-swipe-action-item :auto-close="false" :show="item1.isShow" :threshold="0" :right-options="options" v-for="(item1, index1) in item.dataList" :key="index1" @click="swipeClick($event, index1, item1.index)" @change="swipeChange($event, index1)">
								<view class="content-box" @click="contentClick(item1.index)">
									<text class="content-text">{{item1.title}}</text>
								</view>
							</uni-swipe-action-item>
						</u-swipe-action>
					</view>
				</scroll-view>
			</block>
		</view>
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
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#F56C6C'
				}
			}],
			historyList: [{
				name: "聊天",
				dataList: [],
			},
			{
				name: "问答",
				dataList: [],
			}],
			scrollTop: 0, //tab标题的滚动条位置
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
		}
	},
	onShow () {
		let chatList = []
		for (let key in this.msgAllList) {
			chatList.push({
				title: this.msgAllList[key][1].msg,
				index: key
			})
		}
		this.historyList[0].dataList = chatList
	},
	methods: {
		// 点击左边的栏目切换
		async swichMenu(index) {
			if(index == this.current) return ;
			this.current = index;
			// 如果为0，意味着尚未初始化
			if(this.menuHeight == 0 || this.menuItemHeight == 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight');
				await this.getElRect('u-tab-item', 'menuItemHeight');
			}
			// 将菜单菜单活动item垂直居中
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.' + elClass).fields({size: true},res => {
					// 如果节点尚未生成，res值为null，循环调用执行
					if(!res) {
						setTimeout(() => {
							this.getElRect(elClass);
						}, 10);
						return ;
					}
					this[dataVal] = res.height;
				}).exec();
			})
		},
		contentClick(msgIndex) {
			uni.redirectTo({
				url:'../chat/chat?msgAllListIndex='+msgIndex,
			})
		},
		swipeClick(e, index, msgIndex) {
			let {content} = e;
			if (content.text === '删除') {
				uni.showModal({
					title: '提示',
					content: '是否删除',
					success: res => {
						if (res.confirm) {
							this.historyList[0].dataList.splice(index, 1);
							delete this.msgAllList[msgIndex]
							uni.setStorage({
								key: 'msgAllList',
								data: JSON.stringify(this.msgAllList)
							});
						} else if (res.cancel) {
						}
					}
				});
			}
		},
		swipeChange(e, index) {
			if (e == "left" || e == "right") {
				//循环遍历订单集合
				for (var i = 0; i < this.historyList[0].dataList.length; i++) {
					if (i == index) {
						//将对应下表的订单isShow更改为当前right状态
						this.historyList[0].dataList[i].isShow = "right"
					} else {
						//其它设为关闭状态
						this.historyList[0].dataList[i].isShow = "none"
					}
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}
	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}
	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}
	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}
	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}

	.content-box {
		flex: 1;
		/* #ifdef APP-NVUE */
		justify-content: center;
		/* #endif */
		height: 44px;
		line-height: 44px;
		padding: 0 15px;
		position: relative;
		background-color: #fff;
		border-bottom-color: #f5f5f5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
	.content-text {
		font-size: 15px;
	}
	.emptyTip {
		margin-top: 20vh;
	}
</style>