<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <view slot="content">页面标题</view>
    </cu-custom>
    <view class="container">
      <!-- 通用组件 -->
      <!-- tips组件 -->
      <tui-tips ref="toast" position="top" :backgroundColor="tipsColor"></tui-tips>
      <!-- loading组件 -->
      <view class="cu-load load-modal-mask" v-if="showloading">
        <image src="/static/image/rhomb-white.gif" class="png round" mode="aspectFit"></image>
        <view class="text-gray">{{ loadingText ? loadingText : "加载中" }}</view>
      </view>
      <!-- 通用组件 -->
    </view>
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
      };
    },

    onLoad(e) {},

    async onPullDownRefresh() {},

    methods: {
      // 通用组件调用v0.3
      showTips: function(msg = "成功", type, position = "center", duration = 1500) {
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
    },
  };
</script>
<style scoped>
  .nodata {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    overflow: hidden;
    width: 100%;
  }

  .nodataImg {
    max-width: 600rpx;
    max-height: 600rpx;
  }
</style>
