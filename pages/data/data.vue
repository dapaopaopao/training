<template>
	<view class="">
		

		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#f29100" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="qiun-columns">
							<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
								<view class="qiun-title-dot-light">今天</view>
								<view class="">
									分享
								</view>
							</view>
							<u-empty class="empty" text="毫无训练痕迹" mode="list"  v-if="actionList.length===0?true:false"></u-empty>
							<view  class="wrap-taobao">
								<view class="taobao" v-for="(item,index) in actionList" :key="index" >
									<view class="title">
										<view class="left">
											<!-- <image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image> -->
											<view class="store">{{item.name}}</view>
										</view>
										<!-- <view class="entrance" @click.stop="addNewGroup(item)">新增一组</view>
										<view class="entrance" @click.stop="deleteAction(index)">删除</view> -->
										<view :class=""  v-for="(item1,index1) in item.group" :key='index1'>
											{{item1.weight}}{{item1.unit}} × {{item1.num}}次
										</view>	
									</view>
								</view>
							</view>
							<view class="">
								<view class="qiun-charts" >
									<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
								</view>
							</view>
						</view>
						<view class="qiun-columns">
							<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
								<view class="qiun-title-dot-light">最近30天</view>
							</view>
							<view class="qiun-charts" >
								<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
							</view>
							<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
								<view class="qiun-title-dot-light">最近一周</view>
							</view>
							<view class="qiun-charts" >
								<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
							</view>
						</view>
						
					</scroll-view>
					
				</swiper-item>
				<swiper-item class="swiper-item">
					<view class="content">
						 <v-calendar name="calendar" :defaultTime="time" :extraData="extraData"  @calendarTap="calendarTap" @monthTap="monthTap" />
					</view>
				</swiper-item>
				
				
			</swiper>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../u-charts/u-charts/u-charts.js';
	import calendar from '../../components/tale-calendar/calendar.vue';
	import extraData from './data-test.js'
	import {mapState} from 'vuex'
	
	import chartData from './uchart-data.js'
	var _self;
	var canvaColumn=null;
	var canvaLineA=null;
	var canvaPie=null;
	var lineChartData= {
		categories: ['2012', '2013', '2014', '2015', '2016', '2017','2018'],
		series: [{
			name: '热量（Kcal）',
			data: [3500, 2000, 2005, 3700, 4000, 2000,3100],
			color: '#000000'
		}]
	};
	// var pieData={
	//   "series": [{
	// 	"name": "蛋白质",
	// 	"data": 200
	//   }, {
	// 	"name": "碳水",
	// 	"data": 300
	//   }, {
	// 	"name": "脂肪",
	// 	"data": 60
	//   }]
	// };
	
	export default {

		data() {
			return {
				//日历
				time:{
					year:2020,
					month:5,
					},
				extraData,
				month: {
					year: 2020,
					month: 6
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
				
				//uchart
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				serverData:'',
				
			}
		},
		onLoad() {
			console.log(this.pieData)
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();
			
		},
		onShow(){
			//console.log(this.actionList)
			console.log(this.pieData)
			this.getServerData();
		},
		components: {
			'v-calendar': calendar
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
			//日历
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
				console.log(e);
				
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
			
			//uchart
			getServerData(){
				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data:{
					},
					success: function(res) {
						console.log(res.data.data)
						//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
						_self.serverData=res.data.data;
						let Column={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories=res.data.data.Column.categories;
						Column.series=res.data.data.Column.series;
						 _self.showColumn("canvasColumn",chartData);
						 _self.showLineA("canvasLineA",lineChartData);
						 _self.showPie("canvasPie",_self.pieData);
						
					},
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
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
					legend:{show:true},
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
						}
			
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
