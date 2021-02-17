<template>
	<view>
		<!-- <u-navbar :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
				</view>
			</view>
		</u-navbar> -->
		<view class="u-flex user-box ">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{nickName}}</view>
				<!-- <view class="u-font-14 u-tips-color">微信号:helang_uView</view> -->
			</view>
			<view class="u-m-l-10 u-p-10">
				<!-- <u-icon name="scan" color="#969799" size="28"></u-icon> -->
			</view>
			<!-- <view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view> -->
		</view>
		
		
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="level" title="身体数据" @click="body" ></u-cell-item>
				<u-cell-item icon="tags" title="日记" @click="diary"></u-cell-item>
				<!-- <u-cell-item icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item> -->
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group @click="showModel">
				<u-cell-item icon="email" title="意见反馈" @click="showModel" ></u-cell-item>
				<!-- <u-cell-item icon="setting" title="设置"></u-cell-item> -->
			</u-cell-group>
		</view>
		
		<u-modal v-model="show" title="作者微信" content="qq381281999"></u-modal>
	</view>
</template>

<script>
	
	export default {
		components:{
			
		},
		data() {
			return {
				pic:this.$store.state.userInfo.avatarUrl,
				show:true,
				nickName:this.$store.state.userInfo.nickname,
				show:false
			}
		},
		onLoad() {
			
		},
		onShow(){
			//console.log(this.$store.state.userInfo)
		},
		methods: {
			body(){
				uni.navigateTo({
					url:'/pages/user/body'
				})
			},
			
			diary(){
				uni.navigateTo({
					url:'/pages/user/diary'
				})
			},
			
			showModel(){
				this.show=true
			}
			
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
