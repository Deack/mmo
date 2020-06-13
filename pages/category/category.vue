<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="getList(item.id)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="sitem in slist" :key="sitem.id" class="s-list" :id="'main-'+sitem.id">
				<view class="sitem-title">
					<image :src="sitem.icon" v-if="sitem.icon" class="sitem-title-icon"></image>
					<image src="../../static/default/icon-cloth.png" v-else class="sitem-title-icon"></image>
					<text class="sitem-title-text">{{sitem.name}}</text>
				</view>
				<view @click="navToList(sitem.id)" class="sitem-imgs" >
					<image src="../../static/default/default.jpg" class="show-img"></image>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad(){
			this.getList(0);
			this.getList(1);
		},
		methods: {
			// 请求分类列表
			async getList(_id){
				await uni.request({
					url: 'http://47.93.63.79:8086/app/home/productCateList/'+_id,
					method:'GET',
					success: (res) => {
						console.log(_id);
						console.log(res.data.data)
						if(res.data.code == 200){
							if(_id == 0){
								this.flist = res.data.data;
							}else{
								const iconUrl = 'http://47.93.63.79:8089'
								this.slist = res.data.data
								this.slist.forEach(item=>{
									item.icon = iconUrl+item.icon
								})
								this.currentId = _id;
							}
						}else{
							console.log("ERROR")
							console.log(res.errMsg)
						}
					},
					fail: (error) => {
						console.log(error)
					}
				})
			},
			// 跳转对应的商品列表页面
			navToList(_id){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${_id}`
				})
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						// console.log(data)
						// item.top = h;
						// h += data.height;
						// item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.sitem-title{
		font-size: 28upx;
		.sitem-title-icon{
			float: left;
			width: 32upx;
			height: 32upx;
		}
	}
	.sitem-imgs{
		image{
			width: 140upx;
			height: 140upx;
		}
	}
	/* .s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	} */
</style>
