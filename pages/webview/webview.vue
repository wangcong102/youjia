<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="url">
    </web-view>
  </view>
</template>

<script>
  import base64 from "../../common/crypto/base64";
  export default {
    data() {
      return {
        url: "https://home.u-home.cc/user/#/pages/allotHouse/allotHouse",
        webviewStyles: {
          progress: {
            color: "#FF3333",
          },
        },
        shareParams: {
          title: "【精选房源】分享了快来看一看吧！",
          path: "/page/allotHouse/allotHouse",
          imageUrl: "https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/allot_house_share_post.png",
        },
      };
    },
    onLoad(options) {
      let url = options.url || "https://home.u-home.cc/user/#/pages/allotHouse/allotHouse"
      this.url = base64.decode(url)
    },
    onReady() {},
    onShareAppMessage(options) {
      let shareParams = this.shareParams;
      return {
        title: shareParams.title,
        path: shareParams.path + "?allot_id=" + this.allot_id,
        imageUrl: shareParams.imageUrl,
      };
    },
  };
</script>

<style>
</style>
