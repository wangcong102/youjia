<template>
  <view class="">
    <!--<cu-custom bgColor="bg-blue" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">首页</view>
		</cu-custom>-->

    <!-- 你写的代码 -->
    <view class="total-box">
      <view class="top-box ">
        <view class="cu-bar search bg-white padding-sm">
          <view class="action">
            <text>广州</text>
            <text class="cuIcon-triangledownfill"></text>
          </view>
          <view class="search-form round">
            <text class="cuIcon-search"></text>
            <input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="你要找什么空间"
              confirm-type="search"></input>
          </view>

        </view>
      </view>
      <view class="index-image-box ">
        <view class="align-center ">
          <swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
            :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
            indicator-active-color="#0081ff">
            <swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
              <view class="swiper-item">
                <image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
                <video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover"
                  v-if="item.type=='video'"></video>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="index-icon flex padding-sm text-center ">
        <block v-for="(item,index) in indexIconTaxt" :key="index">
          <view class=" ">
            <view :class="'index-icon-box margin-bottom margin-top-xs bg-icon-index'  + (index + 1)">
              <image class="icon-image text-white" :src="item.url" mode=""></image>
            </view>

            <view class="icon-text margin-lr-sm ">{{item.name}}</view>
          </view>



        </block>

      </view>
      <view class="text-daily  flex  margin ">
        <view class="margin ">
          <view class="daily-text margin-bottom-xs"><text>每日精选</text></view>
          <view class="select-text "><text>挑选精细高质量空间</text></view>
        </view>
        <view class="text-arrow-box margin  ">
          <view class="text-arrow ">
            <!-- <image class="icon-arrow" src="../../static/tabs/下一页.png"></image> -->
          </view>
        </view>

      </view>
      <view class="daily-image ">
        <view class="margin">
          <view class="skill-sequence-panel-content-wrapper">


            <scroll-view scroll-x="true" class="kite-classify-scroll">
              <view class="kite-classify-cell shadow" v-for="(item,index) in swiperList" :key="index">
                <view :class="'nav-li bg-index' + (index + 1)">
                  <view class="nav-name" :src="item.url"></view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <view class="box-item flex  padding" v-for="item in list">
        {{item}}
      </view>

      <view class="icons ">

      </view>
    </view>



    <!-- ... -->



    <!-- 你写的代码 -->
    <!-- ----通用组件---- -->
    <!-- tips组件 -->
    <tui-tips ref="tipstop" position="top" :backgroundColor="tipsColor"></tui-tips>
    <tui-tips ref="tipscenter" position="center" :backgroundColor="tipsColor"></tui-tips>
    <tui-tips ref="tipsbottom" position="bottom" :backgroundColor="tipsColor"></tui-tips>
    <!-- loading组件 -->
    <view class="cu-load load-modal-mask" v-if="showloading">
      <image src="/static/image/rhomb-white.gif" class="png round" mode="aspectFit"></image>
      <view class="text-gray">{{ loadingText ? loadingText : "加载中" }}</view>
    </view>
    <!-- ----通用组件---- -->
  </view>


</template>

<script>
  export default {
    data() {
      return {
        showloading: false,
        loadingText: "加载中...",
        tipsColor: "warning",
        tipsPosition: "top",
        cardCur: 0,
        swiperList: [{
          id: 0,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1597120963873.jpg'
        }, {
          id: 1,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1628421658233.jpg',
        }, {
          id: 2,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1625111615445.jpg'
        }, {
          id: 3,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1622014892542.jpg'
        }, {
          id: 4,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1619056669692.jpg'
        }, {
          id: 5,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1623905274280.jpg'
        }, {
          id: 6,
          type: 'image',
          url: 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1641614966874-b5eb99a569a4.jpg'
        }],
        dotStyle: false,
        indexIconTaxt: [{
            name: "个性空间",
            url: "/static/tabs/首页 (1).png"
          },
          {
            name: "话题讨论",
            url: "/static/tabs/消息 (1).png"
          },
          {
            name: "最新活动",
            url: "/static/tabs/我的活动 (1).png"
          },
          {
            name: "场地攻略",
            url: "/static/tabs/攻略 (1).png"
          },
        ],
        list: ['图片', '列表'],

      };
    },
    onLoad: function(option) {

    },
    onReachBottom() {
      console.log('触发了底部'),
        this.list = [...this.list, ...['图片', '列表']]
    },

    methods: {

      // 通用组件调用v0.3
      showTips: function(
        msg = "成功",
        type,
        position = "center",
        duration = 1500
      ) {
        this.tipsColor = this.utils.text2Color(type);
        this.tipsPosition = position;
        this.$refs[`tips${position}`].showTips({
          msg: msg,
          duration: duration
        });
      },
      loadingCpt: function(operate = false, loadingText = "加载中...") {
        this.showloading = operate;
        this.loadingText = loadingText;
      },
      cardSwiper(e) {
        this.cardCur = e.detail.current
      },
      scroll: function(e) {
        console.log(e)
        this.old.scrollTop = e.detail.scrollTop
      },
    },
  };
</script>
<style>
  /* @import url("//at.alicdn.com/t/font_3183271_ubyt3v6rta.css"); */

  .total-box {
    height: 100%;
    display: flex;
    flex-flow: column;
  }

  .top-box {
    width: 100%;
    height: 130rpx;
  }

  .index-image-box {
    height: 350rpx;
  }

  .index-image {
    width: 650rpx;
    height: 270rpx;
    margin-left: 53rpx;
    border-radius: 20rpx;
  }

  .index-icon {
    height: 200rpx;
  }

  .index-icon-box {
    width: 100rpx;
    height: 100rpx;
    vertical-align: middle;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    /* background-color: #0081ff; */
    border-radius: 50rpx;

  }

  .bg-icon-index1 {
    background-color: rgb(72, 86, 253);
  }

  .bg-icon-index2 {
    background-color: rgb(63, 164, 255);
  }

  .bg-icon-index3 {
    background-color: rgb(142, 107, 237);
  }

  .bg-icon-index4 {
    background-color: rgb(68, 211, 245);
  }

  .icon-image {
    width: 50%;
    height: 50%;
  }

  .icon-text {
    vertical-align: middle;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: 1rpx;
    /* overflow: hidden; */
    white-space: nowrap;
    /* background-color: gray; */
  }

  .text-daily {
    height: 150rpx;
    justify-content: space-between;

  }

  .daily-text {
    color: #060607;
    font-size: 50rpx;
  }

  .select-text {
    color: gray;
    font-size: 20rpx;
  }

  .text-arrow-box {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .text-arrow {
    font-size: 50rpx;
    color: gray;
    width: 60rpx;
    height: 60rpx;

  }

  .icon-arrow {
    height: 100%;
    width: 100%;
  }

  .daily-image {
    /* height: 380rpx; */
  }

  .image-one {
    width: 300rpx;
    height: 300rpx;
    border-radius: 10rpx;
  }

  .skill-sequence-panel-content-wrapper {
    position: relative;
    white-space: nowrap;
    padding: 10rpx 0 10rpx 10rpx;
  }

  .kite-classify-scroll {
    width: 100%;
    height: 380rpx;
    overflow: hidden;
    white-space: nowrap;
  }

  .kite-classify-cell {
    display: inline-block;
    width: 300rpx;
    height: 500rpx;
    margin-right: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    overflow: hidden;
    box-shadow: 2px 2px 3px rgba(26, 26, 26, 0.2);
  }

  .nav-li {
    padding: 40rpx 30rpx;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
  }

  .bg-index1 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1623905274280.jpg);
  }

  .bg-index2 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1628421658233.jpg);
  }

  .bg-index3 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1625111615445.jpg);
  }

  .bg-index4 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1622014892542.jpg);
  }

  .bg-index5 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1597120963873.jpg);
  }

  .bg-index6 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1641614966874-b5eb99a569a4.jpg);
  }

  .bg-index7 {
    background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/house/image/1619056669692.jpg);
  }

  .box-item {
    height: 100rpx;
  }

  .icons {
    height: 100rpx;
  }
</style>
