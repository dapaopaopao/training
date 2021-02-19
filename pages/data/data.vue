<template>
	<view class="">
		<view class="wrap">
			<view class="">
				<view class="qiun-columns">
					<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
						<view class="qiun-title-dot-light">今天</view>
						<!-- <view class=""  v-if="">
							总时间：uni.getStorageSync('trainingTime')
						</view>
						<view class="" v-else>
							总时间：00:00:00
						</view> -->
					</view>
					<u-empty class="empty" text="毫无训练痕迹" mode="list"  v-if="actionList.length===0?true:false"></u-empty>
					<view  class="wrap-taobao">
						<view class="taobao" v-for="(item,index) in actionList" :key="index" >
							<view v-if="item.kind" class="title">
								<view class="left">
									<!-- <image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image> -->
									<view class="store">{{item.name}}</view>
								</view>
								<!-- <view class="entrance" @click.stop="addNewGroup(item)">新增一组</view>
								<view class="entrance" @click.stop="deleteAction(index)">删除</view> -->
								<view :class=""  >
									时间：{{item.restTime}}
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
					<view class="">
						<view class="qiun-charts" >
							<canvas  canvas-id="canvasPie" id="canvasPie" class="charts" @tap="touchPie"></canvas>
						</view>
					</view>
				</view>
				<view class="qiun-columns">
					<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
						<view class="qiun-title-dot-light">最近30天</view>
					</view>
					<view class="qiun-charts" >
						<canvas  canvas-id="canvasColumn" id="canvasColumn" class="charts" @tap="touchColumn"></canvas>
					</view>
					<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
						<view class="qiun-title-dot-light">最近一周</view>
					</view>
					<view class="qiun-charts" >
						<canvas  canvas-id="canvasLineA" id="canvasLineA" class="charts" @tap="touchLineA"></canvas>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../u-charts/u-charts/u-charts.js';
	import calendar from '../../components/tale-calendar/calendar.vue';
	
	import {mapState} from 'vuex'
	
	//import chartData from './uchart-data.js'
	var _self;
	var canvaColumn=null;
	var canvaLineA=null;
	var canvaPie=null;
	
	export default {
		data() {
			return {
				//uchart
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				serverData:'',
				scrollTop: -45,
				
				//
				realLineDate:{
					categories:[],
					series: [{
						name: '热量（Kcal）',
						data: [],
						color: '#000000'
					},
					{
						name: '目标热量（Kcal）',
						data: [],
						color: '#19be6b'
					}
					]
				},
				realColumnDate :
					{
					  categories: ["胸", "背", "肩",'腿','二头','三头'],
					  series: [
						  {
							name: " 训练次数",
							data:[]
						  },
						  ]
					}
			}
		},
		onLoad() {
			//console.log(this.pieData)
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			
			this.getColumnData();
			this.getLineDate();
			this.getServerData();
		},
		onShow(){
			//console.log(this.actionList)
			//console.log(this.pieData)
			this.getServerData();
			
		},
		components: {
			
		},
		computed: {
			...mapState(['actionList','foodList']),
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
			pieData(){
				return {
				  series: [{
					"name": "蛋白质",
					"data": this.protein
				  }, {
					"name": "碳水",
					"data": this.carbohydrate
				  }, {
					"name": "脂肪",
					"data": this.fat
				  }]
				}
			}
		},
		methods: {
			
			
			//uchart
			getServerData(){
				 
				 _self.showLineA("canvasLineA",this.realLineDate);
				 _self.showPie("canvasPie",_self.pieData);	
				 _self.showColumn("canvasColumn",this.realColumnDate);
			},
			showColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'column',
					legend:{show:true},
					fontSize:11,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid:true,
					},
					yAxis: {
						//disabled:true,
						disableGrid:true,
						min:0,
						max:10
					},
					dataLabel: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						column: {
							type:'group',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length
						}
					  }
				});
				
			},
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					fontSize:11,
					legend:{show:true},
					dataLabel:false,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:8,
						disableGrid:true,
					},
					yAxis: {
						//disableGrid:true,
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:8,
						splitNumber:5,
						min:1000,
						max:4500,
						format:(val)=>{return val.toFixed(0)}
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				});
				
			},
			showPie(canvasId,chartData){
				canvaPie=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'pie',
					fontSize:11,
					legend:{
						show:true,
						
						},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
						  lableWidth:15
						}
					},
				});
			},
			touchPie(e){
				
				canvaPie.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data 
					}
				});
			},
			
			touchColumn(e){
				
				canvaColumn.showToolTip(e, {
					textList: [{text:'',color:'#0ea391'}],
					format: function (item, category) {
						
						if(typeof item.data === 'object'){
							this.textList[0].text = `${category}：${item.data.value}次`
							item.data.time.forEach((date,index)=>{
								if(index===0){
									this.textList.push({
										text:`日期：${date}`,
										color:'#0ea391'
									})
								}else{
									this.textList.push({
										text:`          ${date}`,
										color:'#0ea391'
										
									})
								}
							})
							
							return category + ' ' + item.name + ':' + item.data 
						}
					}
				});
			},
			touchLineA(e) {
				
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return `${category}  热量：${item.data} kcal` 
					}
				});
			},
						
			getColumnData(){
				let columnData =  [
								{
									value:0,
									time:[]
								},
								{
									value:0,
									time:[]
								},
								{
									value:0,
									time:[]
								},
								{
									value:0,
									time:[]
								},
								{
									value:0,
									time:[]
								},
								{
									value:0,
									time:[]
								},
							];
				this.$store.state.userInfo.action.forEach((item,index)=>{
					if(item.date>new Date().getTime()-86400000*30){
						let time = new Date(item.date)
						let m = time.getMonth()+1
						let d = time.getDate()
						let pushTime = m + '-' + d
						item.part.forEach((item1,index1)=>{
							switch(item1){
								case '胸': 
									{
										columnData[0].value++
										columnData[0].time.push(pushTime)
										//console.log(columnData[0])
										break;
									}
								case '背':
									{
										columnData[1].value++
										columnData[1].time.push(pushTime)
										break;
									}
								case '肩':
									{
										columnData[2].value++
										columnData[2].time.push(pushTime)
										break;
									}		
								case '腿':
									{
										columnData[3].value++
										columnData[3].time.push(pushTime)
										break;
									}
								case '二头':
									{
										columnData[4].value++
										columnData[4].time.push(pushTime)
										break;
									}
								case '三头':
									{
										columnData[5].value++
										columnData[5].time.push(pushTime)
										break;
									}		
							}
						})
					}
					
				})
				this.realColumnDate.series[0].data=columnData
			},
			
			getLineDate(){
				let heat = this.$store.state.userInfo.food.filter((item)=>{return item.date>new Date().getTime()-86400000*7}).map((item,index)=>{return item.heat})
				console.log('heat',heat)
				let targetHeat = this.$store.state.userInfo.food.filter((item)=>{return item.date>new Date().getTime()-86400000*7}).map((item,index)=>{return item.targetHeat})
				console.log('targetHeat',targetHeat)
				let time = this.$store.state.userInfo.food.filter((item)=>{return item.date>new Date().getTime()-86400000*7}).map((item,index)=>{
					
						let itemTime = new Date(item.date)
						let m = itemTime.getMonth()+1
						let d = itemTime.getDate()
						let pushTime = m + '-' + d
						return pushTime
					
					
				})
				console.log('time',time)
				this.realLineDate.categories=time
				this.realLineDate.series[0].data = heat
				this.realLineDate.series[1].data = targetHeat
				console.log(this.realLineDate)
			},
			
			
			
		}
	};
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	background-color: #f2f2f2;
}
/* #endif */
</style>

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
//uchart
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
