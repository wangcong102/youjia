<template>
  <view class="container">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">账单详情</view>
    </cu-custom>

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
</style>
