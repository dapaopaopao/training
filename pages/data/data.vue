<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#f29100" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<view class="qiun-columns">
						<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
							<view class="qiun-title-dot-light">30天内数据</view>
						</view>
						<view class="qiun-charts" >
							<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
						</view>
						<!-- <view class="qiun-charts" >
									<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
						</view> -->
					</view>
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
	
	
	import chartData from './uchart-data.js'
	var _self;
	var canvaColumn=null;
	var canvaLineA=null;
	var lineChartData= {
		categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
		series: [{
			name: '成交量A',
			data: [35, 20, 25, 37, 4, 20],
			color: '#000000'
		}, {
			name: '成交量B',
			data: [70, 40, 65, 100, 44, 68]
		}, {
			name: '成交量C',
			data: [100, 80, 95, 150, 112, 132]
		}]
	}
	
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
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();
		},
		components: {
			'v-calendar': calendar
		},
		computed: {
			
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
						 _self.showLineA("canvasLineA",lineChartData)
						
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
						//disabled:true
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
									dashLength:8
								},
								yAxis: {
									gridType:'dash',
									gridColor:'#CCCCCC',
									dashLength:8,
									splitNumber:5,
									min:10,
									max:180,
									format:(val)=>{return val.toFixed(0)+'元'}
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
									return category + ' ' + item.name + ':' + item.data 
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
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
}
.swiper-item {
	height: 100%;
}

//uchart
page{background:#F2F2F2;width: 750upx;overflow-x: hidden;}
.qiun-padding{padding:2%; width:96%;}
.qiun-wrap{display:flex; flex-wrap:wrap;}
.qiun-rows{display:flex; flex-direction:row !important;}
.qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{background:#FFFFFF;}
.qiun-title-bar{width:100%; padding:10upx 2%; flex-wrap:nowrap;}
.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000}
.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.charts{width: 750rpx; height:500rpx;background-color: #FFFFFF;}
</style>
