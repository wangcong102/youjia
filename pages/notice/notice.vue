<template>
  <view class="container">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">通知</view>
    </cu-custom>
    <view class="tui-top">
      <tui-list-cell :hover="false" :unlined="true">
        <view class="tui-notice-item">
          <view class="tui-list-item_title">推送通知</view>
          <switch :checked="false" color="#0081ff" class="tui-scale-small" />
        </view>
      </tui-list-cell>
    </view>
    <view class="tui-top">
      <tui-list-cell :hover="false">
        <view class="tui-notice-item">
          <view class="tui-list-item_title">签约通知</view>
          <switch :checked="false" color="#19be6b" class="tui-scale-small" />
        </view>
      </tui-list-cell>
      <tui-list-cell :hover="false">
        <view class="tui-notice-item">
          <view class="tui-list-item_title">支付成功通知</view>
          <switch :checked="true" color="#19be6b" class="tui-scale-small" />
        </view>
      </tui-list-cell>
      <tui-list-cell :hover="false" :unlined="true">
        <view class="tui-notice-item">
          <view class="tui-list-item_title">系统通知</view>
          <switch :checked="false" color="#19be6b" class="tui-scale-small" />
        </view>
      </tui-list-cell>
    </view>
    <view class="tui-top">
      <tui-list-cell :hover="false">
        <view class="tui-notice-item">
          <view class="tui-list-item_title">每周账单</view>
          <switch :checked="false" color="#19be6b" class="tui-scale-small" />
        </view>
      </tui-list-cell>
      <tui-list-cell :hover="false">
        <view class="tui-notice-item">
          <view class="tui-list-item_title">每月账单</view>
          <switch :checked="false" color="#19be6b" class="tui-scale-small" />
        </view>
      </tui-list-cell>
    </view>
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
      };
    },
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

<style lang="scss" scoped>
  .container {
    padding-bottom: 48rpx;

    .tui-top {
      margin-top: 20rpx;
    }

    .tui-notice-item {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $uni-font-size-lg;

      .tui-list-item_title {
        display: flex;
        align-items: center;
      }

      .tui-scale-small {
        transform: scale(0.8);
        transform-origin: 100% center;
      }
    }
  }
</style>
