<script>
import Vue from "vue";
export default {
  onLaunch: function () {
    let that = this;
    // #ifdef APP-PLUS
    /* 5+环境锁定屏幕方向 */
    plus.screen.lockOrientation("portrait-primary"); //锁定

    /* 5+环境升级提示 */
    //app检测更新
    let platform = plus.os.name.toLocaleLowerCase();
    plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
      return false;
      that.tui
        .request(
          "/config/getNewestVersion",
          {
            platform: platform,
            version: widgetInfo.version, //资源版本号
          },
          "POST",
          false,
          true
        )
        .then((res) => {
          if (
            res.code === 200 &&
            res.data &&
            (res.data.updateUrl || res.data.partUpdateUrl)
          ) {
            let data = res.data;
            that.tui.modal(
              "检测到新版本",
              data.updateLog
                ? data.updateLog
                : "请您先更新再进行操作，若不及时更新可能导致部分功能无法正常使用。",
              false,
              (res) => {
                if (data.hasPartUpdate === 0) {
                  //应用市场更新
                  plus.runtime.openURL(data.updateUrl);
                  plus.runtime.restart();
                } else if (data.hasPartUpdate === 1) {
                  //资源更新（服务器端更新）
                  that.tui.href(
                    `/pages/common/update/update?url=${data.partUpdateUrl}`
                  );
                }
              }
            );
          }
        })
        .catch((e) => {});
    });
    // #endif
    // #ifdef MP-WEIXIN
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            that.tui.modal(
              "更新提示",
              "新版本已经上线啦~，为了获得更好的体验，建议立即更新",
              false,
              (res) => {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            );
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            that.tui.modal(
              "更新失败",
              "新版本更新失败，为了获得更好的体验，请您删除当前小程序，重新搜索打开",
              false,
              (res) => {}
            );
          });
        }
      });
    }
    // #endif

    uni.getSystemInfo({
      success: function (e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == "android") {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif

        // #ifdef MP-WEIXIN || MP-QQ
        Vue.prototype.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          Vue.prototype.Custom = capsule;
          // Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
          Vue.prototype.CustomBar =
            capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        }
        // #endif

        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      },
    });
  },
  onShow: function () {},
  onHide: function () {
    //console.log('App Hide')
  },
  onError: function (err) {
    //全局错误监听
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
      const res = uni.getSystemInfoSync();
      let errMsg = `手机品牌：${res.brand}；手机型号：${res.model}；操作系统版本：${res.system}；客户端平台：${res.platform}；错误描述：${err}`;
      console.log("发生错误：" + errMsg);
    });
    // #endif
  },
};
</script>

<style>
/*每个页面公共css uParse为优化版本*/
@import "./common/app.css";
/* #ifndef APP-NVUE */
@import "./components/uni/uParse/src/wxParse.css";
/* #endif */

@import "./common/app.css";
/* iconfont start*/
@import "./common/iconfont/iconfont.css";
@import "./common/iconfont/iconfont-dev.css";
/* iconfont end*/
@import "colorui/main.css";
@import "colorui/icon.css";

/* #ifndef MP-WEIXIN */
@font-face {
  font-family: Harmony;
  font-weight: normal;
  font-style: normal;
  src: url("https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/font/Harmony_SC_Regular.ttf")
    format("truetype");
}
/* #endif */

/* #ifdef MP-WEIXIN */
@font-face {
  font-family: Harmony;
  font-weight: normal;
  font-style: normal;
  src: url("https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/font/Harmony_SC_Regular.ttf")
    format("truetype");
}
/* #endif */
view {
  font-family: Harmony, sans-serif;
}
/* #ifdef H5 */
html {
  max-width: 475px;
}
/* #endif */
</style>
