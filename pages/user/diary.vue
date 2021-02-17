<template>
	<view class="wrap">
		
		<robin-editor class="editor" 
		    @cancel="hideEditor" 
		    @save="addDiary" 
		    v-model="diary"
		    :imageUploader="uploadImg" 
		    :muiltImage="true">
		</robin-editor>
		
	</view>
</template>

<script>
	
	export default{
		components:{
			
		},
		data(){
			return {
				diary:''
			}
		},
		onShow(){
			
			//console.log(uni.getStorageSync('cacheTime')>new Date().getTime()?true:false)
			if(uni.getStorageSync('cacheTime')>new Date().getTime()){
				
					
					this.diary=uni.getStorageSync('diary')
				
			}else{
				uni.removeStorageSync('diary')
				
			}
			
		},
		onUnload(){
			
			
			
		},
		methods:{
			addDiary(){
				this.getCacheTime()
				uni.setStorageSync('diary',this.diary)
				uni.setStorageSync('cacheTime',this.cacheTime)
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add-diary',
					data: {
						_id:this.$store.state.userInfo._id,
						diary:{
							date:new Date().getTime(),
							content:this.diary
						}
					}
				}).then((res) => {
					console.log('diary',this.diary)
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
			},
			
			hideEditor(){
				this.getCacheTime()
				uni.setStorageSync('diary',this.diary)
				uni.setStorageSync('cacheTime',this.cacheTime)
				uni.navigateBack({
					
				})
			},
			
			getCacheTime(){
				// 获取当前日期对象时间戳
				let curDate = new Date()
				
				//马上要到明天的时间对象
				curDate.setHours(23)
				curDate.setMinutes(59)
				curDate.setSeconds(59)
				
				//马上要到明天的时间戳
				this.cacheTime  = curDate.getTime()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		padding: 20rpx;
	}
</style>
