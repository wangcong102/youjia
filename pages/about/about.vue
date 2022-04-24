<!-- 关于作者 -->
<template>
  <view class="about">
    <cu-custom bgColor="bg-transparent" :isCustom="true">
      <view slot="content">关于</view>
    </cu-custom>
    <canvas canvas-id="bubble" :style="'width:' + width + 'px;height:' + height + 'px'" class="like-fx"></canvas>
    <like-fx ref="likeFx" :width="width" :height="height"></like-fx>
    <view class="titleZ text-center align-center">
      <text class="text-bold">关于作者</text>
      <view class="contentZ">
        <text class="text-xl">作者：<b>LAN</b>，一名在读大学生，来自南部的一个小城市，个性不张扬，讨厌随波逐流。</text>
      </view>
    </view>
    <view class="titleZ text-center align-center margin-top-xl">
      <!-- <text class="text-bold">想创业？有需求？有项目？</text> -->
      <view class="contentZ margin-top-lg">
        <text class="text-xl text-bold">「空岚工作室」</text>
        <text class="text-xl">：主营技术服务、技术开发、技术支持、软件开发、互联网服务。开发和运营优家项目包括：微信小程序、微信公众号、后台管理、论坛管理。</text>
      </view>
      <view class="contentZ" style="margin-top: 40rpx">
        <text class="text-xl text-bold">「优家物业」</text>
        <text class="text-xl">：公司主打房东房源直通。励志打造最大的O2O一站式直租房平台。坚持以“真实房源，高效找房”为目标，为房东提供房屋出租和托管服务等一站式服务。
        </text>
      </view>
    </view>
    <button class="" open-type="contact">
      <image src="../../static/image/LAN_logo.png" class="share-img png round shadow-lg bg-white" mode="aspectFit">
      </image>
    </button>
    <!-- ----通用组件---- -->
    <!-- tips组件 -->
    <tui-tips ref="tipstop" position="top" :backgroundColor="tipsColor"></tui-tips>
    <tui-tips ref="tipscenter" position="center" :backgroundColor="tipsColor"></tui-tips>
    <tui-tips ref="tipsbottom" position="bottom" :backgroundColor="tipsColor"></tui-tips>
    <!-- loading组件 -->
    <view class="cu-load load-modal-mask" v-if="showloading">
      <image src="/static/image/rhomb-white.gif" class="png round" mode="aspectFit"></image>
      <view class="text-gray">{{ loadingText ? loadingText : '加载中' }}</view>
    </view>
    <!-- ----通用组件---- -->
  </view>
</template>

<script>
  import LikeFx from '@/components/qdpz/likeFx/likeFx.vue'
  export default {
    components: {
      LikeFx,
    },
    data() {
      return {
        showloading: false,
        loadingText: '加载中...',
        tipsColor: 'warning',
        tipsPosition: 'top',
        animation_timer: null, // 动画定时器
        width: 375,
        height: 1920,
      }
    },
    onLoad() {
      this._startLikeAnimation()
    },
    onUnload() {
      clearInterval(this.animation_timer)
    },
    methods: {
      _startLikeAnimation() {
        this.animation_timer = setInterval(() => {
          this.$refs.likeFx.likeClick()
        }, 1000)
      },
      // 通用组件调用v0.3
      showTips: function(msg = '成功', type, position = 'center', duration = 1500) {
        this.tipsColor = this.utils.text2Color(type)
        this.tipsPosition = position
        this.$refs[`tips${position}`].showTips({
          msg: msg,
          duration: duration
        })
      },
      loadingCpt: function(operate = false, loadingText = '加载中...') {
        this.showloading = operate
        this.loadingText = loadingText
      },
    },
  }
</script>

<style scoped>
  .titleZ {
    width: 750rpx;
    font-size: 52rpx;
    margin-top: 60rpx;
  }

  .contentZ {
    width: 650rpx;
    margin: 10rpx auto 0;
    text-align: left;
  }

  .share-img {
    position: fixed;
    padding: 10rpx;
    width: 100rpx;
    height: 100rpx;
    /* top: 680rpx; */
    bottom: 100rpx;
    right: 20rpx;
    z-index: 1024;
    opacity: 0.8;
    box-shadow: 0rpx 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.3);
    border: none;
  }

  .about {
    margin: 0;
    width: 100%;
    height: 100vh;
    color: #fff;
    background: linear-gradient(-120deg, #f15bb5, #9a5ce5, #01beff, #00f5d4);
    /* background: linear-gradient(-120deg, #0976ea, #c471f5, #f956b6, #ea7e0a); */
    background-size: 500% 500%;
    animation: gradientBG 15s ease infinite;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .like-fx {
    position: fixed;
    right: 0;
    z-index: 1024;
    pointer-events: none;
    /* background-color: red; */
  }
</style>
