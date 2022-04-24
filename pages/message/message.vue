<template>
  <view class="container">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">消息中心</view>
    </cu-custom>
    <view class="container">
      <tui-list-cell :hover="false" :unlined="true">
        <view class="tui-message-item padding-bottom">
          <view>
            <view class="tui-title">开启消息推送</view>
            <view class="tui-sub-title">开启后，可以第一时间收到订阅的消息哦！</view>
          </view>
          <tui-button type="warning" width="140rpx" height="60rpx" :size="24" @click="href(1)">前往设置</tui-button>
        </view>
      </tui-list-cell>
      <view class="tui-top">
        <tui-list-cell @click="href(2)">
          <view class="tui-message-item">
            <view class="tui-title-box">
              <view class="tui-icon-box tui-bg-danger">
                <tui-icon name="kefu" color="#fff" :size="26"></tui-icon>
              </view>
              <view class="tui-title">带看消息</view>
            </view>
            <tui-badge :position="false" type="primary" :scale="false">1</tui-badge>
          </view>
        </tui-list-cell>
        <tui-list-cell @click="href(3)">
          <view class="tui-message-item">
            <view class="tui-title-box">
              <view class="tui-icon-box tui-bg-warning">
                <tui-icon name="transport" color="#fff" :size="28"></tui-icon>
              </view>
              <view class="tui-title">签约通知</view>
            </view>
            <tui-badge :position="false" type="primary" :scale="false">12</tui-badge>
          </view>
        </tui-list-cell>
        <tui-list-cell @click="href(4)">
          <view class="tui-message-item">
            <view class="tui-title-box">
              <view class="tui-icon-box tui-bg-pink">
                <tui-icon name="unreceive" color="#fff" :size="26"></tui-icon>
              </view>
              <view class="tui-title">账单通知</view>
            </view>
            <tui-badge :position="false" type="primary" :scale="false" v-if="false">1</tui-badge>
          </view>
        </tui-list-cell>
        <tui-list-cell @click="href(5)">
          <view class="tui-message-item">
            <view class="tui-title-box">
              <view class="tui-icon-box tui-bg-success">
                <tui-icon name="wallet" color="#fff" :size="26"></tui-icon>
              </view>
              <view class="tui-title">付款通知</view>
            </view>
            <tui-badge :position="false" type="primary" :scale="false">8</tui-badge>
          </view>
        </tui-list-cell>
        <tui-list-cell :unlined="true" @click="href(6)">
          <view class="tui-message-item">
            <view class="tui-title-box">
              <view class="tui-icon-box tui-bg-blue">
                <tui-icon name="message" color="#fff" :size="30"></tui-icon>
              </view>
              <view class="tui-title">系统通知</view>
            </view>
            <tui-badge :position="false" type="primary" :scale="false">10</tui-badge>
          </view>
        </tui-list-cell>
      </view>
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
      href(type) {
        if (type == 1) {
          this.tui.href("/pages/notice/notice");
        } else {
          this.tui.toast("功能开发中~");
        }
      },
    },
  };
</script>

<style lang="scss">
  .container {

    .tui-message-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      box-sizing: border-box;

      .tui-title {
        font-size: $uni-font-size-lg;
      }

      .tui-sub-title {
        font-size: $uni-font-size-sm;
        color: $uni-text-color-grey;
        padding-top: 4rpx;
      }

      .tui-title-box {
        display: flex;
        align-items: center;
        justify-content: center;

        .tui-icon-box {
          width: 88rpx;
          height: 88rpx;
          color: $uni-text-color-inverse;
          border-radius: $uni-border-radius-lg;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: $uni-spacing-row-base;
        }

        .tui-bg-danger {
          background-color: $uni-color-error;
        }

        .tui-bg-warning {
          background-color: $uni-color-warning;
        }

        .tui-bg-success {
          background-color: $uni-color-success;
        }

        .tui-bg-primary {
          background-color: $uni-color-primary;
        }

        .tui-bg-pink {
          background-color: $uni-color-pink;
        }

        .tui-bg-blue {
          background-color: $uni-color-primary;
        }
      }
    }

    // .tui-top {
    //   margin-top: 20rpx;
    // }
  }
</style>
