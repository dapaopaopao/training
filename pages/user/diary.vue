<template>
	<view class="wrap">
		
		<!-- <robin-editor class="editor" 
		    @cancel="hideEditor" 
		    @save="addDiary" 
		    v-model="diary"
		    :imageUploader="uploadImg" 
		    :muiltImage="false"
			:tools="[]">
		</robin-editor>
		 -->
		
		<view class="" style="display: flex;justify-content: space-around;align-items: center;margin-top: 10rpx;margin-bottom: 20rpx;">
					 
					 <view class="" style="font-size: 35rpx;" @click="hideEditor()">
					 	返回
					 </view>
					 <view class="" style="font-size: 35rpx;" @click="addDiary()">
					 	保存
					 </view>
		</view> 
		<u-line color="#c0c4cc" />
		<view class="" style="margin-top: 20rpx;">
			<textarea v-model="diary" placeholder="随便写写..."  style="width: 100%;height: 1000rpx;"  :maxlength='-1'  />
		</view>
		
		
		
		<!-- <editor id="editor" class="ql-container" placeholder="随便写写..." @ready="onEditorReady"></editor>
		 <u-line color="#c0c4cc" />
		 <view class="" style="display: flex;justify-content: space-around;align-items: center;margin-top: 20rpx;">
			 <view class="" style="font-size: 35rpx;border-bottom:solid 1rpx #C0C4CC;padding-bottom: 10rpx;" @click="undo()">
			 	清空
			 </view>
			 <view class="" style="font-size: 35rpx;border-bottom:solid 1rpx #C0C4CC;padding-bottom: 10rpx;" @click="hideEditor()">
			 	返回
			 </view>
			 <view class="" style="font-size: 35rpx;border-bottom:solid 1rpx #C0C4CC ;padding-bottom: 10rpx" @click="addDiary()">
			 	保存
			 </view>
		 </view> -->
		 
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
			
			 onEditorReady() {
			                // #ifdef MP-BAIDU
			                this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editorId');
			                // #endif
			
			                // #ifdef APP-PLUS || H5 ||MP-WEIXIN
			                uni.createSelectorQuery().select('#editor').context((res) => {
			                  this.editorCtx = res.context
			                }).exec()
			                // #endif
			            },
			            undo() {
			                this.editorCtx.undo()
			            }
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		padding: 20rpx;
		
	}
	
	
	    #editor {
	        width: 100%;
	        height: 1050rpx;
	        background-color: #ffffff;
	    }
	
	    button {
	        margin-top: 10px;
	    }
</style>
