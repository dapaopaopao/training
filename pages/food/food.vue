<template>
	<view class="wrap">
		<view class="sum-wrap">
			<view class="">
				<u-button type="primary" size="mini">蛋白质:{{protein}}</u-button>
				
			</view>
			<view class="">
				<u-button type="warning" size="mini">碳水:{{carbohydrate}}</u-button>
				
			</view>
			<view class="">
				<u-button type="success" size="mini">脂肪:{{fat}}</u-button>
				
			</view>
			<view class="">
				<u-button type="error" size="mini">热量:{{heat}}</u-button>
				
			</view>
		</view>
		<view class="">
			<button type="default" @click="addFood">保存</button>
		</view>
		<view class="taobao" v-for="(item,index) in foodList" :key="index" >
			<view class="title" @click="showGroup(index)">
				<view class="left">
					<image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image>
					<view class="store">{{item.name}}</view>
				</view>
				<!-- <view class="entrance" @click.stop="addNewGroup(item)">新增一组</view> -->
				<view class="entrance" @click.stop="deleteAction(index)">删除</view>
			</view>
			<view :class="['ticket',showGroupList[index]?'active':'']"  >
				<view class="left">
					
					<view class="introduce">
						<view class="top">
							<u-number-box v-model="item.weight" :step="unit==='g'?100:1" @change=""></u-number-box>
							<view class="unit" @click="changeUnit">
								{{unit}}
							</view>
						</view>
						
						<view class="date u-line-1">
							
								<view  class="">
									蛋白质：{{item.protein*item.weight}} {{unit}}
								</view>
								<view class="">
									碳水：{{item.carbohydrate*item.weight}} {{unit}}
								</view>
								<view class="">
									脂肪：{{item.fat*item.weight}} {{unit}}
								</view>
							
							
						</view>
					</view>
				</view>
				<view class="right">
					<!-- <view class="use immediate-use" @click="" disaled='false'>
						完成
					</view> -->
					<!-- <view class="use immediate-use" :round="true" >删除</view> -->
				</view>
			</view>
			
			
		</view>
		<u-mask :show="showCountDown" @click="showCountDown = false" :mask-click-able='false'>
				<view class="mask">
					<view class="countDown"  @tap.stop>
						<u-circle-progress active-color="#2979ff"  width="400" bg-color="opacity" :percent="countDownNumPercent">
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
				unit:'g',
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
					},
					cacheTime:0
				
			}
		},
		onShow(){
			console.log(this.foodList)
		},
		onHide(){
			this.getCacheTime()
			uni.setStorageSync('foodList',this.$store.state.foodList)
			uni.setStorageSync('cacheTime',this.cacheTime)
		},
		computed:{
			...mapState(['foodList']),
			
			protein(){
				return this.foodList.reduce((pre,cur)=>{
					return pre + cur.protein * cur.weight
				},0)
			},
			carbohydrate(){
				return this.foodList.reduce((pre,cur)=>{
					return pre + cur.carbohydrate * cur.weight
				},0)
			},
			fat(){
				return this.foodList.reduce((pre,cur)=>{
					return pre + cur.fat * cur.weight
				},0)
			},
			heat(){
				return this.fat*9+this.protein*4+this.carbohydrate*4
			}
		},
		
		methods:{
			addNewGroup(item){
				let newGroup = JSON.parse(JSON.stringify(item.group[item.group.length-1])) 
				newGroup.restTime=0
				item.group.length>0? item.group.push(newGroup):item.group.push(this.group)
			},
			
			deleteAction(index){
				
				this.foodList.splice(index,1)
			},
			
			deleteGroup(actionIndex,groupIndex){
				this.foodList[actionIndex].group.splice(groupIndex,1)
				
			},
			
			changeUnit(){
				
				this.unit = this.unit==='kg'? 'g':'kg'
			},
			
			
			showGroup(index){
				let f = this.showGroupList[index] = !this.showGroupList[index]
				this.$set(this.showGroupList,index,f)
				console.log(this.showGroupList)
			},
			
			switchToAction(){
				console.log('11')
				uni.navigateTo({
					url:"/pages/food/selectFood"
				})
			},
			
			addFood() {
				let newFoodList =  this.foodList.map((item,index)=>{
					return Object.assign({},{
						name:item.name,
						weight:item.weight
					})
				})
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add',
					data: {
						_id:this.$store.state.userInfo._id,
						food:{
							date:new Date().getTime(),
							foodList:newFoodList,
							protein:this.protein,
							carbohydrate:this.carbohydrate,
							fat:this.fat,
							heat:this.heat
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
			}
			
			
		}
	}
	
	
</script>

<style lang="scss" scoped>
	.wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 20rpx;
		.sum-wrap{
			width: 100%;
			display: flex;
			justify-content: space-around;
		}
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
					opacity: 100;
					
					
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
						margin-bottom: 20rpx;
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
