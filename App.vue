<script>
	var _self = null
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.checkToken()
		},
		onShow: function() {
			console.log('App Show')
			//this.checkToken()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			checkToken() {
				_self = this
				if(!uni.getStorageSync('uni_id_token')){
					// uni.showModal({
					// 	showCancel: false,
					// 	content: '请先登录'
					// })
					uni.redirectTo({
						url:'/pages/login/login'
					})
				}else{
					uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'checkToken'
						},
						success(res) {
							// uni.showModal({
							// 	showCancel: false,
							// 	content: JSON.stringify(res.result)
							// })
							if(res.result.code!==0){
								uni.redirectTo({
									url:'/pages/login/login'
								})
							}else{
								console.log('自动登录成功')
								uni.switchTab({
									url:'/pages/data/data'
								})
								//console.log(res.result)
								_self.$store.state.userInfo=res.result.userInfo
								console.log('userInfo',_self.$store.state.userInfo)
								
								//判断缓存是否过期
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
								const {
									code,
									token,
									tokenExpired
								} = res.result
								//console.log(token)
								if(token){
									uni.setStorageSync('uni_id_token', token)
									uni.setStorageSync('uni_id_token_expired', tokenExpired)
								}
							}
							
						},
						fail(e) {
						
							uni.redirectTo('/pages/login/login')
							uni.showModal({
								showCancel: false,
								content: '请求云函数失败，请稍后再试'
							})
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
