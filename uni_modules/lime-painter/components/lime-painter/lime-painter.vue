<template>
	<view class="page">
		<demo-block title="json用法">
			<image :src="picture" v-if="picture" mode="widthFix"></image>
			<l-painter :board="poster" @success="picture = $event" isCanvasToTempFilePath ref="json" style="position: fixed;left: 1500rpx;width: 750rpx;" path-type="url"></l-painter>
		</demo-block>
		<demo-block title="基础用法">
			<l-painter ref="painter">
				<l-painter-view css="background: #07c160; height: 120rpx; width: 120rpx; display: inline-block">
				</l-painter-view>
				<l-painter-view
					css="background: #1989fa; height: 120rpx; width: 120rpx; border-top-right-radius: 60rpx; border-bottom-left-radius: 60rpx; display: inline-block; margin: 0 30rpx;">
				</l-painter-view>
				<l-painter-view
					css="background: #ff9d00; height: 120rpx; width: 120rpx; border-radius: 50%; display: inline-block">
				</l-painter-view>
			</l-painter>
		</demo-block>
		<demo-block title="View 容器">
			<l-painter>
				<l-painter-view css="background: #f0f0f0; padding-top: 100rpx;">
					<l-painter-view css="background: #d9d9d9; width: 33.33%; height: 100rpx; display: inline-block">
					</l-painter-view>
					<l-painter-view css="background: #bfbfbf; width: 66.66%; height: 100rpx; display: inline-block">
					</l-painter-view>
				</l-painter-view>
			</l-painter>
		</demo-block>
		<demo-block title="Text 文本">
			<l-painter>
				<l-painter-view css="background: #f5f5f5; padding: 30rpx; color: #222a29">
					<l-painter-text text="登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼" />
					<l-painter-text text="登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼"
						css="text-align:center; padding-top: 20rpx; text-decoration: line-through " />
					<l-painter-text text="登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼" css="text-align:right; padding-top: 20rpx" />
					<l-painter-text text="水调歌头\n明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。"
						css="line-clamp: 3; padding-top: 20rpx; background: linear-gradient(,#ff971b 0%, #1989fa 100%); background-clip: text" />
				</l-painter-view>
			</l-painter>
		</demo-block>
		<demo-block title="Image 图片">
			<l-painter>
				<l-painter-view>
					<l-painter-text text="基础用法"
						css="margin-top: 30rpx; display: block; padding-bottom:20rpx; color: #999" />
					<l-painter-view>
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx" />
					</l-painter-view>
				</l-painter-view>
				<l-painter-view>
					<l-painter-text text="填充方式"
						css=" margin-top: 30rpx; display: block; padding-bottom:20rpx; color: #999" />
					<l-painter-view css="display: inline-block; padding-right: 12rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: contain; background: #f5f5f5" />
						<l-painter-text text="contain" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
					<l-painter-view css="display: inline-block; padding: 0 12rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: cover; background: #f5f5f5" />
						<l-painter-text text="cover" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
					<l-painter-view css="display: inline-block; padding: 0 12rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: fill; background: #f5f5f5" />
						<l-painter-text text="fill" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
					<l-painter-view css="display: inline-block; margin-top: 30rpx">
						<l-painter-image
							src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"
							css="width: 200rpx; height: 200rpx; object-fit: none; background: #f5f5f5" />
						<l-painter-text text="none" css="margin-top: 10rpx; display: block; text-align:center;" />
					</l-painter-view>
				</l-painter-view>
			</l-painter>
		</demo-block>
		<demo-block title="QRcode 二维码">
			<l-painter>
				<l-painter-qrcode text="limeui.qcoon.cn" css="width: 200rpx; height: 200rpx" />
			</l-painter>
		</demo-block>
		<demo-block title="栗子海报">
		<image v-if="picture" :src="picture" mode="widthFix"></image>
		<l-painter css="width: 750rpx; padding-bottom: 100rpx; background: linear-gradient(180deg,#ff971b 0%, #ff5000 100%)" 
				@fail="fail"
				@done="done"
				pathType="url"
				ref="poster"
				>
			<l-painter-image src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"  css="background: #ffffff; object-fit: cover; margin-left: 40rpx; margin-top: 40rpx; width: 84rpx; border: 2rpx solid #ffffff; box-sizing: border-box; height: 84rpx; border-radius: 50%;"/>
			<l-painter-view css="margin-top: 40rpx; padding-left: 20rpx; display: inline-block">
				<l-painter-text text="隔壁老王" css="display: block; padding-bottom: 10rpx; color: #ffffff; font-size: 32rpx; fontWeight: bold"/>
				<l-painter-text text="为您挑选了一个好物?" css="color: rgba(255,255,255,.7); font-size: 24rpx"/>
			</l-painter-view>
			<l-painter-view css="margin-left: 40rpx; margin-top: 30rpx; padding: 32rpx; box-sizing: border-box; background: #ffffff; border-radius: 16rpx; width: 670rpx; box-shadow: 0 20rpx 58rpx rgba(0,0,0,.15)">
				<l-painter-image src="https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg"  css="object-fit: cover; object-position: 50% 50%; width: 606rpx; height: 606rpx;"/>
				<l-painter-view css="margin-top: 32rpx; color: #FF0000; font-weight: bold; font-size: 28rpx; line-height: 1em;">
					<l-painter-text text="￥" css="vertical-align: bottom"/>
					<l-painter-text text="39" css="vertical-align: bottom; font-size: 58rpx"/>
					<l-painter-text text=".39" css="vertical-align: bottom"/>
					<l-painter-text text="￥59.99" css="vertical-align: bottom; padding-left: 10rpx; font-weight: normal; text-decoration: line-through; color: #999999"/>
				</l-painter-view>
				<l-painter-view css="margin-top: 32rpx; font-size: 26rpx; color: #8c5400">
					<l-painter-text text="自营" css="color: #212121; background: #ffb400;"/>
					<l-painter-text text="30天最低价" css="margin-left: 16rpx; background: #fff4d9; text-decoration: line-through;"/>
					<l-painter-text text="满减优惠" css="margin-left: 16rpx; background: #fff4d9"/>
					<l-painter-text text="超高好评" css="margin-left: 16rpx; background: #fff4d9"/>
				</l-painter-view>
				<l-painter-view css="margin-top: 30rpx; display:flex; justify-content: space-between">
					<l-painter-text css="line-clamp: 2; color: #333333; line-height: 1.8em; font-size: 36rpx; width: 462rpx"  text="360儿童电话手表9X 智能语音问答定位支付手表 4G全网通20米游泳级防水视频通话拍照手表男女孩星空蓝" ></l-painter-text>
					<l-painter-qrcode css="width: 128rpx; height: 128rpx;" text="limeui.qcoon.cn"></l-painter-qrcode>
				</l-painter-view>
			</l-painter-view>
		</l-painter>
		<button type="default" @click="save">save</button>
	</demo-block>
	</view>
</template>

<script>
	export default {
		data: () => ({
			picture: '',
			show: false,
			"poster": {
					"css": {
						"width": "750rpx",
						"height": "1333rpx"
					},
					"views": [{
						"type": "image",
						"src": "https://download.cheshangji.cn/poster/other/1640568807267147.jpg",
						"css": {
							"width": "750rpx",
							"height": "1333rpx",
							"background": "white",
							"position": "fixed",
							"top": "0",
							"left": "0",
							"zIndex": -1
						}
					}, {
						"css": {
							"width": "750rpx",
							"position": "fixed",
							"top": "610rpx",
							"left": "303rpx"
						},
						"views": [{
							"type": "view",
							"css": {
								"width": "150rpx",
								"height": "150rpx",
								"background": "#FFF"
							},
							"views": [{
								"type": "image",
								"src": "http://img.tysondata.com/teams/20190219230652029_100x100.png",
								"css": {
									"width": "138rpx",
									"height": "138rpx",
									"marginTop": "6rpx",
									"marginLeft": "6rpx"
								}
							}]
						}]
					}]
				},
		}),
		methods: {
			close() {
				this.show = false
			},
			fail(v) {
				console.log(v)
			},
			done(v) {
				console.log('绘制完成')
			},
			save() {
				this.$refs.poster.canvasToTempFilePathSync({
					fileType: 'jpg',
					quality: 1,
					success: (res) => {
						console.log(res.tempFilePath)
						this.picture = res.tempFilePath
					}
				})
			},
			// 保存图征
			saveImage() {
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.picture,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success',
							duration: 2000
						});
					},
				});
				// #endif
			}
		}
	};
</script>

<style lang="stylus" scoped>

</style>
