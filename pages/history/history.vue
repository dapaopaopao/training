<template>
<view class="">
	<view class="content">
		 <v-calendar name="calendar" :defaultTime="time" :extraData="extraData"  @calendarTap="calendarTap" @monthTap="monthTap" />
	</view>
	<view v-if="showFoodDetail || showActionDetail || showDiaryDetail" class="">
		<view  class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view  class="qiun-title-dot-light">训练</view>
			
		</view>
		<view  class="wrap-taobao">
			<view class="taobao" v-if="showActionDetail" v-for="(item,index) in riliDetail" :key="index" >
				<view v-if="item.kind" class="title">
					<view class="left">
						<!-- <image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image> -->
						<view class="store">{{item.name}}</view>
					</view>
					<!-- <view class="entrance" @click.stop="addNewGroup(item)">新增一组</view>
					<view class="entrance" @click.stop="deleteAction(index)">删除</view> -->
					<view :class=""  v-for="(item1,index1) in item.group" :key='index1'>
						时间：{{item1.restTime}}
					</view>	
				</view>
				<view v-else class="title">
					<view class="left">
						<!-- <image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image> -->
						<view class="store">{{item.name}}</view>
					</view>
					<!-- <view class="entrance" @click.stop="addNewGroup(item)">新增一组</view>
					<view class="entrance" @click.stop="deleteAction(index)">删除</view> -->
					<view :class=""  v-for="(item1,index1) in item.group" :key='index1'>
						{{item1.weight}} {{item1.unit}} × {{item1.num}} 次
					</view>	
				</view>
			</view>
		</view>
		
		<view  class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view  class="qiun-title-dot-light">饮食</view>
		</view>	
			<view class="wrap-taobao">
				<view class="taobao" v-if="showFoodDetail" >
					<view class="title">
						<view class="left">
							<view class="store">
								蛋白质: {{foodDetail.protein}} 克
							</view>
							<view class="store">
								碳水: {{foodDetail.carbohydrate}} 克
							</view>
							<view class="store">
								脂肪: {{foodDetail.fat}} 克
							</view>
							<view class="store">
								热量: {{foodDetail.heat}} kcal
							</view>
							<view class="store">
								目标热量: {{foodDetail.targetHeat}} kcal
							</view>
						</view>
						
						
					</view>
				</view>
			</view>
			
			<view  class="qiun-bg-white qiun-title-bar qiun-common-mt" >
				<view  class="qiun-title-dot-light">日记</view>
			</view>	
			<view class="wrap-taobao">
				<view class="diary" v-if="showDiaryDetail">
					<view class="">
						{{diaryDetail.content}}
					</view>
				</view>
			</view>
			
			
		</view>
</view>
	
</template>

<script>
	
		import calendar from '../../components/tale-calendar/calendar.vue';
		
		import {mapState} from 'vuex'
		
		
	// 	let extraData=[
	// 	{'date': '2020-6-3', 'value': '腿', dot: true, active: true},
	// 	{'date': '2020-6-5', 'value': '胸', dot: true, active: false},
	// 	{'date': '2020-6-11', 'value': '背', dot: true, active: true},
	// 	{'date': '2020-6-12', 'value': '肩', dot: true, active: true}
	// ]
		
		
		export default {
			data() {
				return {
					//日历
					showActionDetail:false,
					showFoodDetail:false,
					showDiaryDetail:false,
					diaryDetail:{},
					riliDetail:{},
					foodDetail:{},
					time:{
						year:new Date().getFullYear(),
						month:new Date().getMonth(),
						},
					extraData:[],
					month: {
						year: new Date().getFullYear(),
						month: new Date().getMonth()+1
					},
					list: [
						{
							name: '总结'
						},
						{
							name: '日历'
						}
						
					],
					current: 0,
					swiperCurrent: 0,
					tabsHeight: 0,
					dx: 0,
					
				}
			},
			onLoad() {
				//console.log(this.pieData)
			
				//this.getRili()
				this.getRiliData()
			},
			onShow(){
			
				this.getRiliData()
				this.getRili()
			},
			components: {
				'v-calendar': calendar
			},
			computed: {
				...mapState(['actionList','foodList']),
				
			},
			methods: {
				//日历
				getRiliData(){
					this.extraData=this.$store.state.userInfo.action.map((item,index)=>{
						let time = new Date(item.date)
						let y = time.getFullYear()
						let m = time.getMonth()+1
						let d = time.getDate()
						let pushTime = y+'-'+m + '-' + d
						return {date:pushTime,value:item.part}
					})
					//console.log(this.extraData)
				},
				getRili() {
					// uni.showLoading({
					// 	title: '处理中...'
					// })
					uniCloud.callFunction({
						name: 'get'
					}).then((res) => {
						// uni.hideLoading()
						// uni.showModal({
						// 	content: `查询成功，获取数据列表为：${JSON.stringify(res.result.data)}`,
						// 	showCancel: false
						// })
						// console.log(res)
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `查询失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
				},
				// tab栏切换
				change(index) {
					this.swiperCurrent = index;
					//this.getOrderList(index);
				},
				transition({ detail: { dx } }) {
					this.$refs.tabs.setDx(dx);
				},
				animationfinish({ detail: { current } }) {
					this.$refs.tabs.setFinishCurrent(current);
					this.swiperCurrent = current;
					this.current = current;
				},
				calendarTap(e) {
					//console.log(e);
					let {year,month,day}=e
					month++
					let riliTime = year + '-' + month + '-' + day
					//console.log(riliTime)
					
					
					for(let item of this.$store.state.userInfo.action){
						let time = new Date(item.date)
						let y = time.getFullYear()
						let m = time.getMonth()+1
						let d = time.getDate()
						let pushTime = y+'-'+m + '-' + d
						
						if(pushTime===riliTime){
							this.riliDetail = item.actionList
							
							this.showActionDetail=true
							break
						}else{
							this.showActionDetail=false
						}
					}              
					
					for(let item of this.$store.state.userInfo.food){
						let time = new Date(item.date)
						let y = time.getFullYear()
						let m = time.getMonth()+1
						let d = time.getDate()
						let pushTime = y+'-'+m + '-' + d
						
						if(pushTime===riliTime){
							this.foodDetail = item
							
							this.showFoodDetail=true
							break
						}else{
							this.showFoodDetail=false
						}
					}
					
					for(let item of this.$store.state.userInfo.diary){
						let time = new Date(item.date)
						let y = time.getFullYear()
						let m = time.getMonth()+1
						let d = time.getDate()
						let pushTime = y+'-'+m + '-' + d
						
						if(pushTime===riliTime){
							this.diaryDetail = item
							
							this.showDiaryDetail=true
							break
						}else{
							this.showDiaryDetail=false
						}
					}
					
					
				},
				monthTap(val) {
					let {year, month} = val;
					this.month = {
						year: year,
						month: month,
					}
					// 此处获取动态的数据，赋值给extraData
					this.extraData = this.extraData
				},
				
			
				
				
			}
	};
</script>

<style lang="scss" scoped>
	.wrap-taobao{
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
		background-color: white;
		padding: 10rpx;
	}
	.diary{
		margin: 10rpx 10rpx 10rpx 10rpx;
		width: 100%;
		background-color:#F3F4F6;
		padding: 30rpx 20rpx 20rpx;
		border-radius: 20rpx;
	}
	.taobao {
		margin: 10rpx 10rpx 10rpx 10rpx;
		width: 47%;
		background-color:#F3F4F6;
		padding: 30rpx 20rpx 20rpx;
		border-radius: 20rpx;
		.title {
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;
			font-size: 30rpx;
			.left {
				
				
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
	}	
	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;
		.top {
			display: flex;
			justify-content: space-between;
			.left {
				display: flex;
				align-items: center;
				.store {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}
			.right {
				color: $u-type-warning-dark;
			}
		}
		.item {
			display: flex;
			margin: 20rpx 0 0;
			.left {
				margin-right: 20rpx;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}
			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}
				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}
				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}
			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;
				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}
				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}
		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;
			.total-price {
				font-size: 32rpx;
			}
		}
		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;
			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}
			.evaluate {
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
			}
		}
	}
	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;
		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}
		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}
		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}
	.wrap {
		display: flex;
		flex-direction: column;
		//height: calc(100vh - var(--window-top));
		height::100vh;
		width: 100%;
	}
	.swiper-box {
		flex: 1;
	}
	.swiper-item {
		height: 100%;
	}
	.empty{
		background-color: white;
	}
	
	page{background:#F2F2F2;width: 750upx;overflow-x: hidden;}
	.qiun-padding{padding:2%; width:96%;}
	.qiun-wrap{display:flex; flex-wrap:wrap;}
	.qiun-rows{display:flex; flex-direction:row !important;}
	.qiun-columns{display:flex; flex-direction:column !important;}
	.qiun-common-mt{margin-top:10upx;display: flex;justify-content: space-between;}
	.qiun-bg-white{background:#FFFFFF;}
	.qiun-title-bar{width:100%; padding:10upx 2%; flex-wrap:nowrap;}
	.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000}
	.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
	.charts{width: 750rpx; height:500rpx;background-color: #FFFFFF;}
</style>