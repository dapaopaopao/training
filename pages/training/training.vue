<template>
	<view class="wrap">
		<button type="default" @click="addAction">传给后台</button>
		<button type="default" @click="loginByWeixin">登录</button>
		<view class="taobao" v-for="(item,index) in actionList" :key="index" >
			<view class="title" @click="showGroup(index)">
				<view class="left">
					<image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image>
					<view class="store">{{item.name}}</view>
				</view>
				<view class="entrance" @click.stop="addNewGroup(item)">新增一组</view>
				<view class="entrance" @click.stop="deleteAction(index)">删除</view>
			</view>
			<view :class="['ticket',showGroupList[index]?'active':'']"  v-for="(item1,index1) in item.group" :key='index1'>
				<view class="left">
					<view class="picture">
						{{index1+1}}
					</view>
					<view class="introduce">
						<view class="top">
							<u-number-box v-model="item1.weight" :step="2.5" :positive-integer='false' @change=""></u-number-box>
							<!-- <u-input class="item-input" v-model="item1.weight" type="number" placeholder="重量" :border='true' /> -->
							<view class="unit" @click="changeUnit(item1.unit)">
								{{item1.unit}}
							</view>
						</view>
						<view class="top">
							<u-number-box v-model="item1.num" :step="1" @change=""></u-number-box>
							<!-- <u-input v-model="item1.num" type="number" placeholder="次数" :border='true' /> -->
							<view class="unit">
								次
							</view>
						</view>
						<view class="date u-line-1">休息时间:{{item1.restTime}}秒</view>
					</view>
				</view>
				<view class="right">
					<view class="use immediate-use" @click="countDown(item1,$event)" disaled='false'>
						完成
					</view>
					<view class="use immediate-use" :round="true" @click="deleteGroup(index,index1)">删除</view>
				</view>
				
			</view>
		</view>
		
		<u-mask :show="showCountDown" @click="showCountDown = false" :mask-click-able='false'>
				<view class="mask">
					<view class="countDown"  @tap.stop>
						<u-circle-progress active-color="#2979ff"  width="400" bg-color="opacity"  :percent="countDownNumPercent">
								<view class="u-progress-content">
									<view class="">
										休息时间倒计时
									</view>
									<view class="u-progress-info">
										{{countDownNum}}
									</view>
								</view>
							</u-circle-progress>
					</view>
					<view class="mask-button">
						<u-button @click="addTime" type="success">+10秒</u-button>
						<u-button @click="reduceTime" type="success">-10秒</u-button>
						<u-button @click="endCountDown" type="success">不休息了</u-button>
					</view>
				</view>
		</u-mask>
		<view class="add" @click="switchToAction">
			<u-icon name="plus" size="100" ></u-icon>
			
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				unit:'kg',
				showCountDown:false,
				countDownNum:60,
				sumCountDown:60,
				currentGroup:null,
				timer:'',
				showGroupList:[],
				group:
					{
						weight:0,
						num:0,
						time:60,
						restTime:0
					}
				
			}
		},
		
		computed:{
			...mapState(['actionList']),
			countDownNumPercent(){
				return  this.countDownNum/this.sumCountDown*100
			},
			restTime(){
				return this.sumCountDown-this.countDownNum
			}
		},
		
		methods:{
			addNewGroup(item){
				let newGroup = JSON.parse(JSON.stringify(item.group[item.group.length-1])) 
				newGroup.restTime=0
				item.group.length>0? item.group.push(newGroup):item.group.push(this.group)
			},
			
			deleteAction(index){
				
				this.actionList.splice(index,1)
			},
			
			deleteGroup(actionIndex,groupIndex){
				this.actionList[actionIndex].group.splice(groupIndex,1)
				
			},
			
			changeUnit(unit){
				
				unit = unit ==='kg'? 'lb':'kg'
			},
			
			countDown(item,e){
				console.log(e)
				this.currentGroup = item
				this.countDownNum = item.time
				this.sumCountDown=item.time
				this.timer = setInterval(()=>{
					if(this.countDownNum>0){
						this.countDownNum--
						//console.log(this.countDownNum)
					}else{
						clearInterval(this.timer)
					}},1000)
				this.showCountDown=true
			},
			
			addTime(){
				this.countDownNum += 10
				this.sumCountDown +=10
			},
			
			reduceTime(){
				this.countDownNum -= 10
				this.sumCountDown -= 10
			},
			
			endCountDown(){
				this.showCountDown=false
				clearInterval(this.timer)
				this.currentGroup.restTime=this.restTime
				this.currentGroup=null
			},
			
			showGroup(index){
				let f = this.showGroupList[index] = !this.showGroupList[index]
				this.$set(this.showGroupList,index,f)
				console.log(this.showGroupList)
			},
			
			switchToAction(){
				console.log('11')
				uni.navigateTo({
					url:"/pages/action/action"
				})
			},
			
			
			//登录
			loginByWeixin() {
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
					uni.showModal({
						showCancel: false,
						content: JSON.stringify(res.result)
					})
					if (res.result.code === 0) {
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
					}
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
							resolve(res.code)
						},
						fail(err) {
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},
			
			
			//传给后台
			addAction() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add',
					data: {
						name: 'DCloud',
						subType: 'uniCloud',
						createTime: Date.now()
					}
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: `成功添加一条数据，文档id为：${res.result.id}`,
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
			
			
		}
	}
	
	
</script>

<style lang="scss" scoped>
	.wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		
		.add{
			margin-top: 20rpx;
		}
	}
	
	.mask{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
		.mask-button{
			display: flex;
			justify-content: space-around;
			width: 100%;
		}
		.countDown{
			height: 80%;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			
			
			
			.u-progress-content {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					//opacity: 100;
					//background-color: white;
					
					
				}
				
				
				
				.u-progress-info {
					font-size: 60rpx;
					font-weight: bold;
					margin-right: 10rpx;
					margin-top: 10rpx;
				}
		}
	}
	
	.taobao {
		margin-top: 20rpx;
		width: 700rpx;
		background-color:#F3F4F6;
		padding: 30rpx 20rpx 20rpx;
		border-radius: 20rpx;
		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			font-size: 30rpx;
			.left {
				display: flex;
				align-items: center;
			}
			.store {
				font-weight: 500;
			}
			.buddha {
				width: 70rpx;
				height: 70rpx;
				border-radius: 10rpx;
				margin-right: 10rpx;
			}
			.entrance {
				color: $u-type-info;
				border: solid 2rpx $u-type-info;
				line-height: 48rpx;
				padding: 0 30rpx;
				background: none;
				border-radius: 15px;
			}
		}
		.ticket {
			display: flex;
			.left {
				width: 70%;
				padding: 30rpx 20rpx;
				background-color: rgb(255, 245, 244);
				border-radius: 20rpx;
				border-right: dashed 2rpx rgb(224, 215, 211);
				display: flex;
				.picture {
					width: 172rpx;
					border-radius: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.introduce {
					margin-left: 10rpx;
					
					
					.top{
						display: flex;
						//justify-content: space-around;
						color:$u-type-warning;
						font-size: 28rpx;
						margin-bottom: 10rpx;
						//width: 150rpx;
						.item-input{
							
						}
						.unit{
							display: flex;
							justify-content: center;
							align-items: center;
							width:100rpx
						}
						.big{
							font-size: 60rpx;
							font-weight: bold;
							margin-right: 10rpx;
						}
					}
					.type{
						font-size: 28rpx;
						color: $u-type-info-dark;
					}
					.date{
						margin-top: 10rpx;
						font-size: 20rpx;
						color: $u-type-info-dark;
					}
				}
			}
			.right {
				width: 30%;
				padding: 40rpx 20rpx;
				background-color: rgb(255, 245, 244);
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				.use{
					height: auto;
					padding: 0 20rpx;
					font-size: 24rpx;
					border-radius: 40rpx;
					color: #ffffff!important;
					background-color: $u-type-warning!important;
					line-height: 40rpx;
					color: rgb(117, 142, 165);
					margin-left: 20rpx;
				}
			}
			
		}
		.active{
			display: none;
		}
	}
</style>
