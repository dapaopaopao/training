<template>
	<view class="wrap">
		<view class="">
			<image src="../../static/center-selected.png" mode=""></image>
			<button  open-type="getUserInfo"   @getuserinfo="loginByWeixin">微信登录</button>
			
		</view>
		
		
	</view>
	
</template>

<script>
	var _self= null;
	var userInfo= null
	export default{
	
		data(){
			return{
				
			}
		},
		onLoad(){
			
			//this.checkToken()
		},
		methods:{
			//登录
			loginByWeixin() {
				_self =this
				uni.showLoading({
					title: '登录中...'
				})
				this.getWeixinCode().then((code) => {
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'loginByWeixin',
							params: {
								code,
							}
						}
					})
				}).then((res) => {
					// uni.showModal({
					// 	showCancel: false,
					// 	content: JSON.stringify(res.result)
					// })
					uni.hideLoading()
					console.log('登录成功')
					_self.$store.state.userInfo=res.result.userInfo
						
					if(uni.getStorageSync('cacheTime')>new Date().getTime()){
						if(uni.getStorageSync('actionList')){
							_self.$store.state.actionList=uni.getStorageSync('actionList')
						}
						if(uni.getStorageSync('foodList')){
							_self.$store.state.foodList=uni.getStorageSync('foodList')
						}
					}else{
						uni.removeStorageSync('actoionList')
						uni.removeStorageSync('foodList')
					}
					
					//console.log(this.$store.state.userInfo)
					uni.switchTab({
						url:'/pages/data/data'
					})
					if (res.result.code === 0) {
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
					}
					uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'updateUser',
							params: {
								nickname: userInfo.nickName,
								avatarUrl:userInfo.avatarUrl
							}
						},
						success(res) {
							// uni.showModal({
							// 	showCancel: false,
							// 	content: JSON.stringify(res.result)
							// })
						},
						fail(e) {
							console.error(e)
							uni.showModal({
								showCancel: false,
								content: '请求云函数失败，请稍后再试'
							})
						}
					})
					_self.$store.state.userInfo=res.result.userInfo
					
				}).catch((e) => {
					console.error(e)
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试'
					})
				})
			},
			getWeixinCode() {
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS
					weixinAuthService.authorize(function(res) {
						resolve(res.code)
					}, function(err) {
						console.log(err)
						reject(new Error('微信登录失败'))
					});
					// #endif
					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {				
									//_self.$store.state.wxUserInfo=infoRes.userInfo
									console.log(infoRes.userInfo)
									userInfo=infoRes.userInfo
									
								}
							});
							resolve(res.code,userInfo)
						},
						fail(err) {
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		height: 100vh;
		display: flex;
		
		justify-content:center;
		align-items: center;
	}
</style>
