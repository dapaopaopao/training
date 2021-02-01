<template>
	<view class="wrap">
		<view class="taobao">
			<view class="title">
				<view class="left">
					<image class="buddha" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1975388697,1068670603&fm=26&gp=0.jpg" mode="aspectFill"></image>
					<view class="store">袜子精保护协会</view>
				</view>
				<view class="entrance" @click="addNewGroup(item)">新增一组</view>
				<view class="entrance">删除</view>
			</view>
			<view class="ticket">
				<view class="left">
					<image
						class="picture"
						src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578059523488&di=5f592ac19c1b983005d3e85add469756&imgtype=0&src=http%3A%2F%2Fimg010.hc360.cn%2Fg7%2FM00%2F2D%2FB9%2FwKhQs1QfUo6EdeM-AAAAALwk1hM072.jpg"
						mode="widthFix"
					></image>
					<view class="introduce">
						<view class="top">
							￥
							<text class="big">3</text>
							满88减3
						</view>
						<view class="type">店铺优惠券</view>
						<view class="date u-line-1">2019.11.28-2020.1.24</view>
					</view>
				</view>
				<view class="right">
					<view class="use immediate-use" :round="true">去使用</view>
				</view>
				
			</view>
		</view>
		<view class="action-card" v-for="(item,index) in actionList" :key="index">
			<view class="">
				{{item.name}}
			</view>	
			<view class="" v-for="(item1,index1) in item.group" :key='index1'>
				<u-row gutter="16">
							<u-col span="1">
								<view class="">
									{{index1+1}}
								</view>
							</u-col>
							<u-col span="4">
								<u-input class="item-input" v-model="item1.weight" type="number" placeholder="重量"border=true />
							</u-col>
							<u-col span="4">
								<u-input v-model="item1.num" type="number" placeholder="次数" border=true />
							</u-col>
							<u-col span="4">
									123
							</u-col>
						</u-row>
			</view>
			<u-button @click="addNewGroup(item)">新增一组</u-button>
		</view>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				group:[
					{
						weight:0,
						num:0
					}
				]
			}
		},
		
		computed:{
			...mapState(['actionList'])
		},
		
		methods:{
			addNewGroup(item){
				item.group.push(JSON.parse(JSON.stringify(item.group[item.group.length-1])) )
			}
		}
	}
	
	
</script>

<style lang="scss" scoped>
	.wrap{
		display: flex;
		justify-content: center;
	}
	
	.action-card{
		background-color:#606266;
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
				}
				.introduce {
					margin-left: 10rpx;
					.top{
						color:$u-type-warning;
						font-size: 28rpx;
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
				align-items: center;
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
	}
</style>
