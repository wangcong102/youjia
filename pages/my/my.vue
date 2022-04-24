<template>
  <view>
    <scroll-view scroll-y class="scrollPage">
      <view class="UCenter-bg">
        <image class="bg" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/default_bg.png"
          mode="scaleToFill"></image>
        <view class="userInfo">
          <view class="avatar bg-white">
            <image class="avatar" :src="userInfo.uuid? userInfo.avatar_url: 'https://z3.ax1x.com/2021/04/02/ceK4L6.png'"
              mode="aspectFill"></image>
          </view>
          <view class="nickname padding-tb-sm">
            <text>{{ userInfo.uuid ? (userInfo.nickname?userInfo.nickname:"未设置昵称" ): "未登录" }}</text>
          </view>
        </view>
        <image class="gif-wave" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/wave.gif"
          mode="scaleToFill"></image>
      </view>
      <scroll-view scroll-x class="bg-white nav">
        <view class="flex text-center">
          <view :class="'cu-item flex-sub ' + (TabCur == 0 ? 'text-blue cur' : '')" @tap="tabSelect" :data-id="0">实时排行
          </view>
        </view>
      </scroll-view>
      <view class="padding-xs flex text-center text-blue bg-white" v-if="0 == TabCur">
        <view class="flex flex-sub flex-direction solid-right">
          <view class="margin-top-xs">本周签约流水</view>
          <view class="text-xxl text-blue">{{ lastWeekBill ? lastWeekBill : 0 }}</view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="margin-top-xs">本月签约流水</view>
          <view class="text-xxl text-blue">{{ lastMonthBill ? lastMonthBill : 0 }}</view>
        </view>
      </view>
      <navigator url="/pages/billRank/billRank" hover-class="none">
        <view class="padding-sm flex text-center text-blue bg-white justify-center radius-bottom over-hidden"
          @tap="subscribeMessage">查看排行榜</view>
      </navigator>
      <block v-if="userInfo.uuid">
        <view class="cu-list menu sm-border card-menu margin-top">
          <view class="cu-item arrow" v-if="utils.role2Code(userInfo.role)>=utils.role2Code('boss')">
            <navigator class="content" hover-class="none" url="/pages/admin/admin" open-type="navigate">
              <span class="iconfont icon-guanliyuan text-blue margin-right-sm"></span>
              <text class="text-grey">管理员</text>
            </navigator>
          </view>
          <view class="cu-item arrow">
            <navigator class="content" hover-class="none" url="/pages/message/message" open-type="navigate">
              <span class="iconfont icon-xiaoxi1 text-blue margin-right-sm"></span>
              <text class="text-grey">消息中心</text>
            </navigator>
          </view>
          <view class="cu-item arrow">
            <navigator class="content" hover-class="none" url="/pages/release/release" open-type="navigate">
              <span class="iconfont icon-tianjia text-blue margin-right-sm"></span>
              <text class="text-grey">添加房屋</text>
            </navigator>
          </view>
          <view class="cu-item arrow">
            <navigator class="content" hover-class="none" url="/pages/staffBills/staffBills" open-type="navigate">
              <span class="iconfont icon-caiwuliushui text-blue margin-right-sm"></span>
              <text class="text-grey">流水记录</text>
            </navigator>
          </view>
          <view class="cu-item arrow">
            <navigator class="content" hover-class="none" url="/pages/favorites/favorites" open-type="navigate">
              <span class="iconfont icon-shoucang1 text-blue margin-right-sm"></span>
              <text class="text-grey">我的收藏</text>
            </navigator>
          </view>

          <view class="cu-item arrow">
            <navigator class="content" hover-class="none" url="/pages/set/set" open-type="navigate">
              <span class="iconfont icon-setting-copy-copy text-blue margin-right-sm"></span>
              <text class="text-grey">设 置</text>
            </navigator>
          </view>
        </view>

        <view class="cu-tabbar-height"></view>
        <view class="flex-sub">
          <view class="text-df padding-sm text-center">
            <text class="text-gray">{{ hitokoto.hitokoto }}</text>
          </view>
          <view class="padding-right padding-bottom-sm text-xs text-right">
            <text class="text-gray">{{ hitokoto.dash }}{{ hitokoto.from }}</text>
          </view>
        </view>
        <!-- 
        <view class="cu-list menu sm-border card-menu margin-top">
          <view class="cu-item arrow">
            <button class="cu-btn content" style="font-weight: 400">
              <span class="iconfont icon-tousujianyi text-blue margin-right-sm"></span>
              <text class="text-grey">房屋反馈</text>
            </button>
          </view>
          <view class="cu-item arrow">
            <button class="cu-btn content" open-type="feedback" style="font-weight: 400">
              <span class="iconfont icon-yijianfankui1 text-blue margin-right-sm"></span>
              <text class="text-grey">意见反馈</text>
            </button>
          </view>
        </view> -->
      </block>

      <block v-else>
        <view class="box .margin-top-lg">
          <view class="cu-bar btn-group"><button class="cu-btn bg-blue shadow-blur round lg" @click="handleLogin">
              登录
            </button></view>
        </view>
      </block>
    </scroll-view>
    <!-- 登录横幅 -->
    <view :class="'cu-modal ' + (showLoginModal ? 'show' : '')">
      <view class="cu-dialog">
        <view class="bg-img" style="
            background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/logo_banner.png);
            height: 200px;
          ">
          <view class="cu-bar justify-end text-white">
            <view class="action" @tap="hideModal"><text class="cuIcon-close"></text></view>
          </view>
        </view>
        <view class="cu-bar bg-white">
          <view class="action margin-0 flex-sub solid-left text-blue" @tap="hideModal">好的</view>
        </view>
      </view>
    </view>
    <!-- 登录横幅 -->
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
        TabCur: 0,
        userInfo: {},
        showLoginModal: false,
        loginID: "0000119", //改变此值用户需要重新登录
        power: "",
        totalFund: 0,
        scrollLeft: "",
        showLoading: false,
        loadingText: "",
        hitokoto: {},
        lastWeekBill: 0,
        lastMonthBill: 0,
        showApplyJobTips: false,
      };
    },

    onLoad(options) {
      this.hitokotoFun();
      if (options.from == "login" && !uni.getStorageSync("logined")) {
        this.showLoginModal = true;
        uni.setStorageSync("logined", true);
      }
    },
    onShow() {
      let exp = uni.getStorageSync("exp");
      if (parseInt(new Date().getTime() / 1000) <= exp) {
        this.userInfo = uni.getStorageSync("userInfo");
        this.power = uni.getStorageSync("power");
      } else {
        let phone = uni.getStorageSync("phone");
        let password = uni.getStorageSync("password");
        uni.clearStorageSync();
        uni.setStorageSync("phone", phone);
        uni.setStorageSync("password", password);
        this.userInfo = [];
        this.power = [];
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
      // 三十分钟刷新一言
      let hitokoto = this.hitokoto || 0;
      if (new Date().getTime() - hitokoto.time >= 30 * 60 * 1000) {
        this.hitokotoFun();
      }
      // 获取员工业绩
      this.getStaffBill();
      // 获取最新用户资料
      this.getUserInfo()
    },

    methods: {
      //登录
      async handleLogin(e) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
      },
      // 获取员工业绩
      getStaffBill() {
        this.http
          .get("/bill/rank/staff", {
            data: {
              date_range: "week",
            },
          })
          .then((res) => {
            console.log("week", res);
            this.lastWeekBill = res.data.bill_total;
          })
          .catch((err) => {
            console.log(err);
          });

        this.http
          .get("/bill/rank/staff", {
            data: {
              date_range: "month",
            },
          })
          .then((res) => {
            console.log("month", res);
            this.lastMonthBill = res.data.bill_total;
          })
          .catch((err) => {
            console.log(err);
          });
      },

      tabSelect(e) {
        this.TabCur = e.currentTarget.dataset.id;
        this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
      },

      hideModal() {
        this.showLoginModal = false;
      },

      subscribeMessage() {
        /* #ifdef MP */
        uni.requestSubscribeMessage({
          tmplIds: ["onoSD21HcOFEGGgfzlX6nyEPOBTdiKJUpXTYufiYJfA"],
        });
        /* #endif */
      },
      // 获取个人信息
      getUserInfo() {
        this.http
          .get("/user/account", {})
          .then((res) => {
            if (res.code != 200) {
              this.showTips(res.msg, 'warning')
            } else {
              this.userInfo = res.data;
              uni.setStorageSync("userInfo",res.data)
            }
          });
      },
      // 一言接口
      hitokotoFun(c) {
        this.http
          .get(
            "https://v1.hitokoto.cn/?encode=json&c=" +
            c +
            "&max_length=24&min_length=0"
          )
          .then((res) => {
            console.log(res);
            res.dash = "——";
            res.time = new Date().getTime();
            this.hitokoto = res;
          });
      },
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
    },
  };
</script>
<style>
  .UCenter-bg {
    background-size: cover;
    height: 400rpx;
    display: flex;
    justify-content: center;
    overflow: hidden;
    position: relative;
    flex-direction: column;
    align-items: center;
  }

  .UCenter-bg text {
    opacity: 0.8;
  }

  .UCenter-bg .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  .UCenter-bg .userInfo {
    width: 200rpx;
    z-index: 9;
  }

  .UCenter-bg .userInfo .avatar {
    border-radius: 100%;
    width: 200rpx;
    height: 200rpx;
    box-shadow: 0rpx 0rpx 10rpx rgba(255, 255, 255, 0.9);
  }

  .UCenter-bg .userInfo .nickname {
    position: absolute;
    font-size: 50rpx;
    color: #fff;
    font-weight: 400;
    white-space: normal;
    left: 50%;
    transform: translateX(-50%);
    text-shadow: 2rpx 2rpx 15rpx rgb(99, 99, 99);
  }

  .UCenter-bg .gif-wave {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    mix-blend-mode: screen;
    height: 100rpx;
  }
</style>
