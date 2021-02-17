<template>
	<view class="wrap">
		<view class="clock-wrap">
			<view class="" style="display: flex;justify-content: center;align-items: center;">
				<u-icon  v-if="showTime" name="clock" size="100" @click="startTime"></u-icon>
				<u-icon v-if="!showTime" name="clock-fill" size="100" @click="endTime"></u-icon>
				<view style="font-size: 56rpx;">{{hour}}:{{minute}}:{{second}}</view>
			</view>
			<view class="">
				<u-button type="default" size="medium" @click="this.showModel=true"> 完成全部训练</u-button>
				<u-modal v-model="showModel" @confirm="addAction()" @cancel="this.showModel=false" ref="uModal" content="练完了吗?" :show-title='false' :show-cancel-button='true' :async-close="true"></u-modal>
			</view>
			<view class="add" @click="switchToAction">
				<view class="" style="display: flex;justify-content: center;align-items: center;">
					<u-icon name="plus" size="56" ></u-icon>
					<view class="" style="font-size: 50rpx;">
						添加动作
					</view>
				</view>
				
			</view>
			
		</view>
		
		
		<view class="taobao" v-for="(item,index) in actionList" :key="index" >
			<view class="title" @click="showGroup(index)">
				<view class="left">
					<image class="buddha" :src="item.icon" mode="aspectFill"></image>
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
						休息
					</view>
					<view class="use immediate-use" :round="true" @click="deleteGroup(index,index1)">删除</view>
				</view>
				
			</view>
		</view>
		
		<u-mask :show="showCountDown" @click="showCountDown = false" :mask-click-able='false'>
				<view v-if="showCountDown" class="mask">
					<view class="countDown"  @tap.stop>
						<!-- <u-circle-progress active-color="#2979ff"  width="400" bg-color="opacity"  :percent="countDownNumPercent"> -->
						<cmd-progress type="circle" :percent="countDownNumPercent"  :showInfo="false" :width="200" ></cmd-progress>
							<view class="u-progress-content" style="position: absolute;top: 30%;background-color: white;border-radius: 50%;height: 360rpx;width: 360rpx;">
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
		
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import cmdProgress from '../../components/cmd-progress/cmd-progress.vue'
	
	export default {
		data() {
			return {
				unit:'kg',
				showCountDown:false,
				countDownNum:0,
				sumCountDown:0,
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
				cacheTime:0,
				
				
				//计时器
				hour:"00",
				minute:"00",
				second:"00",
				totalCount:0,
				timerSum:null,
				showTime:true,
				
				
				showModel:false
			}
		},
		components:{
			cmdProgress
		},
		onShow(){
			//console.log(this.$store.state.userInfo.action)
		},
		onHide(){
			this.getCacheTime()
			uni.setStorageSync('actionList',this.$store.state.actionList)
			uni.setStorageSync('cacheTime',this.cacheTime)
			
		},
		computed:{
			...mapState(['actionList','part']),
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
				if(this.actionList.length===0){
					this.part=[]
				}
			},
			
			deleteGroup(actionIndex,groupIndex){
				this.actionList[actionIndex].group.splice(groupIndex,1)
				
			},
			
			changeUnit(unit){
				
				unit = unit ==='kg'? 'lb':'kg'
			},
			
			countDown(item,e){
				//console.log(item,e)
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
				//console.log(this.showGroupList)
			},
			
			switchToAction(){
				//console.log('11')
				uni.navigateTo({
					url:"/pages/action/action"
				})
			},
			
			
			
			
			
			//传给后台
			addAction() {
				// uni.showLoading({
				// 	title: '处理中...'
				// })
				uniCloud.callFunction({
					name: 'add-action',
					data: {
						_id:this.$store.state.userInfo._id,
						action:{
							date:new Date().getTime(),
							trainingTime:`${this.hour}:${this.minute}:${this.second}`,
							part:this.part,
							actionList:this.actionList
						}
					}
				}).then((res) => {
					//uni.hideLoading()
					this.showModel=false
					clearInterval(this.timer);
					uni.showModal({
						content: `保存成功`,
						showCancel: false
					})
					//console.log(res)
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
			},
			
			startTime(){
				let _this = this;
				let count = 0;
				_this.timerSum = setInterval(function(){
					count++;
					_this.second = _this.showNum(count % 60);
					_this.hour = _this.showNum(parseInt(count / 60 / 60));
					_this.minute = _this.showNum(parseInt(count / 60) % 60);
					_this.totalCount = count;
				},1000);
				this.showTime = false;
			},
			
			endTime(){
				this.showTime = true;
				clearInterval(this.timerSum);
			},
			
			showNum(num) {
				if (num < 10) {
					return '0' + num
				}
				return num
			},
			
			
			
			
			
		}
	}
	
	
</script>

<style lang="scss" scoped>
	.wrap{
		display: flex;
		padding-top: 200rpx;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.clock-wrap{
			z-index: 99;
			background-color: white;
			position: fixed;
			top:0;
			padding: 20rpx;
			display: flex;
			width: 100%;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
		}
		.add{
			margin-top: 20rpx;
			display: flex;
			width: 100%;
			justify-content: center;
			align-items: center;
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
			position: relative;
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
				padding: 20rpx 20rpx;
				background-color: rgb(255, 245, 244);
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				.use{
					height: auto;
					padding: 0 20rpx;
					font-size: 30rpx;
					border-radius: 40rpx;
					color: #ffffff!important;
					background-color: $u-type-warning!important;
					line-height: 50rpx;
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
