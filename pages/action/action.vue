<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<!-- <view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索动作</text>
			</view> -->
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in tabbar" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<!-- <view class="item-title">
								<text>{{item.name}}</text>
							</view> -->
							<view class="item-container">
								<view :class="['item-container-2',chooseList.find((action)=>{return action.name===item1.name})?'isActive':'']" @click="chooseAction(item1,item.name)" v-for="(item1, index1) in item.actions" :key="index1">
									<view class="thumb-box" >
										<image class="item-menu-image" :src="item1.icon" mode=""></image>
										<view class="item-menu-name">{{item1.name}}</view>
									</view>
									<view >
										
									</view>
									
								</view>
								<view class="item-button-box">
									<u-button class="item-button"  v-if="hasChoose"  @click="cancleChoose">取消</u-button>
									<u-button class="item-button"  v-if="hasChoose" @click="setChoose(item)">添加</u-button>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	//import classifyData from "@/common/classify.data.js";
	import classifyData from "@/pages/action/actionData.js";
	import {mapState,mapMutations,mapGetters} from 'vuex';
	let partObj = {}
	for(let item of classifyData){
		partObj[item.name]=0
	}
	//console.log(partObj)
	export default {
		data() {
			return {
				tabbar: classifyData,
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				chooseList:[]
			}
		},
		computed: {
			...mapState(['actionList','part']),
			hasChoose(){
				return this.chooseList.length===0?false:true
			}
		},
		methods: {
			
			...mapMutations(['addAction','deleteAction','resetActionList']),
			...mapGetters(['getLength']),
			
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			
			chooseAction(action,part){
				let actionName= action.name
				let actionIndex= this.chooseList.findIndex((item)=>{
					return item.name===actionName
				})
				//let actionIndex = this.chooseList.indexOf(actionName)
				if(actionIndex<0){
					this.chooseList.push(JSON.parse(JSON.stringify(action)) )
					//console.log(this.chooseList)
					partObj[part] +=1
					//this.addAction(actionName)
				}else{
					this.chooseList.splice(actionIndex,1)
					//console.log(this.chooseList)
					partObj[part] -=1
					//this.deleteAction(actionIndex)
				}
				
				//console.log(this.chooseList)
			},
			
			cancleChoose(){
				//this.resetActionList()
				this.chooseList=[]
				//console.log(this.chooseList)
			},
			
			setChoose(item){
				this.actionList.push(...this.chooseList)
				//console.log(this.chooseList)
				this.chooseList=[]
				for(let part in partObj){
					if(partObj[part]>0){
						if(this.part.indexOf(part)<0){
							this.part.push(part)
						}
						
					}
				}
				console.log('part',this.part)
				uni.navigateBack({
					
				})
				// uni.switchTab({
				//     url: '/pages/training/training'
				// });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
		position: relative;
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
		
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
		width: 200rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
		//flex-direction: column;
		
		
	}
	
	.item-container-2{
		margin-top: 30rpx;
		display: flex;
		width: 50%;
		justify-content: center;
		align-items: center;
	}
	
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		//margin-top: 20rpx;
		
	}
	
	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		//background-color: opacity;
	}
	
	.isActive{
		
		background-color: rgb(255, 245, 244);
		border-radius: 20rpx;
	}
	
	.item-button-box{
		display: flex;
		//justify-content: space-around;
		position: fixed;
		
		right: 0;
		bottom: 0px;
		width: 80%;
		background-color: white;
	}
	
	.item-button{
		margin: 10px;
		flex:1 1 auto ;
		
	}
</style>
