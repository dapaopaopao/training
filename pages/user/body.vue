<template>
	<view class="wrap">
		<u-form :model="form" ref="uForm">
				<u-form-item label="体重">
					<view class="" style="display: flex;">
						<u-input :clearable="false" v-model="form.weight" style="width: 80%;" />
						<view class="">
							kg
						</view>
					</view>
				</u-form-item>
				<u-form-item label="胸围">
					<view class="" style="display: flex;">
						<u-input v-model="form.chest" :clearable="false"  style="width: 80%;" />
						<view class="">
							cm
						</view>
					</view>
				</u-form-item>
				<u-form-item label="臂围">
					<view class="" style="display: flex;">
						<u-input v-model="form.arm" :clearable="false"  style="width: 80%;" />
						<view class="">
							cm
						</view>
					</view>
				</u-form-item>
				<u-form-item label="腰围">
					<view class="" style="display: flex;">
						<u-input v-model="form.waist" :clearable="false"  style="width: 80%;" />
						<view class="">
							cm
						</view>
					</view>
				</u-form-item>
				<u-form-item label="腿围">
					<view class="" style="display: flex;">
						<u-input v-model="form.leg" :clearable="false"  style="width: 80%;" />
						<view class="">
							cm
						</view>
					</view>
				</u-form-item>
				<u-button @click="addBody">保存</u-button>
		</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{
					weight:'',
					chest:'',
					arm:'',
					waist:'',
					leg:''
				}
			}
		},
		onLoad(){
			if(this.$store.state.userInfo.body){
				let length = this.$store.state.userInfo.body.length-1
				if(length>=0){
					this.form=this.$store.state.userInfo.body[length].data
				}
			}
		},
		methods:{
			addBody(){
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add-body',
					data: {
						_id:this.$store.state.userInfo._id,
						body:{
							date:new Date().getTime(),
							data:this.form
						}
					}
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: `保存成功`,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `添加数据失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		padding: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 750rpx;
	}
</style>
