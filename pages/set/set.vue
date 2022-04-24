<template>
  <view class="tui-set-box">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">个人资料</view>
    </cu-custom>
    <tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(1)">
      <view class="tui-list-cell tui-info-box">
        <image :src="userInfo.avatar_url" class="tui-avatar bg-gray round over-hidden" mode="aspectFill">
        </image>
        <view>{{ userInfo.nickname? userInfo.nickname:"未设置昵称" }}</view>
      </view>
    </tui-list-cell>
    <view class="tui-mtop">
      <tui-list-cell padding="0" :lineLeft="false" :arrow="true">
        <view class="tui-list-cell"> 账户与安全 </view>
      </tui-list-cell>
      <tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(3)">
        <view class="tui-list-cell"> 消息提醒设置 </view>
      </tui-list-cell>
    </view>
    <view class="tui-mtop">
      <tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(4)">
        <view class="tui-list-cell"> 关于我们 </view>
      </tui-list-cell>
      <tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(5)">
        <view class="tui-list-cell"> 意见反馈 </view>
      </tui-list-cell>
    </view>

    <view class="tui-exit">
      <tui-button shape="circle" shadow type="primary" height="88rpx" @click="handleLoginOut">退出登录</tui-button>
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
      userInfo: {
        id: "",
        uuid: "",
        uuid: "",
        realName: "",
        nickname: "",
        role: "",
        gender: 3,
        avatar_url: "",
        username: "",
        phone: "",
        qq: "",
        wechat: "",
        email: "",
        base_salary: "",
        payQrcode: "",
      },
    };
  },
  onLoad(options) {
    this.userInfo = uni.getStorageSync("userInfo");
    this.getUserInfo(this.userInfo.uuid);
  },
  onShow() {
    this.getUserInfo(this.userInfo.uuid);
  },
  methods: {
    href(page) {
      let url = "";
      switch (page) {
        case 1:
          url = "/pages/userInfo/userInfo";
          break;
        case 2:
          url = "/pages/notice/notice";
          break;
        case 3:
          url = "/pages/notice/notice";
          break;
        case 4:
          url = "/pages/about/about";
          break;
        case 5:
          url = "/pages/feedback/feedback";
          break;
        default:
          break;
      }
      uni.navigateTo({
        url: url,
      });
    },
    getUserInfo(uuid) {
      this.loadingCpt(true);
      console.log(uuid);
      this.http
        .get("/user/account", {
          data: {
            uuid: uuid,
          },
        })
        .then((res) => {
          if (res.code != 200) {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          } else {
            this.userInfo = res.data;
            uni.setStorageSync("userInfo", this.userInfo);
          }
          return res.data;
        });
      this.loadingCpt(false);
    },
    //登出
    handleLoginOut() {
      this.loadingCpt(true, "退出登录中");
      setTimeout(() => {
        this.loadingCpt(false);
        let phone = uni.getStorageSync("phone");
        let password = uni.getStorageSync("password");
        uni.clearStorageSync();
        uni.setStorageSync("phone", phone);
        uni.setStorageSync("password", password);
        this.userInfo = [];
        this.power = [];
        this.totalFund = 0;
        uni.navigateTo({
          url: "/pages/login/login?source=set",
        });
      }, 1000);
    },

    // 通用组件调用v0.3
    showTips: function (
      msg = "成功",
      type,
      position = "center",
      duration = 1500
    ) {
      this.tipsColor = this.utils.text2Color(type);
      this.tipsPosition = position;
      this.$refs[`tips${position}`].showTips({ msg: msg, duration: duration });
    },
    loadingCpt: function (operate = false, loadingText = "加载中...") {
      this.showloading = operate;
      this.loadingText = loadingText;
    },
  },
};
</script>

<style>
.tui-set-box {
  padding-bottom: 20rpx;
  color: #333;
}

.tui-list-cell {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  font-size: 30rpx;
}

.tui-info-box {
  font-size: 34rpx;
}

.tui-avatar {
  width: 140rpx;
  height: 140rpx;
  margin-right: 20rpx;
}

.tui-mtop {
  margin-top: 20rpx;
}

.tui-exit {
  padding: 100rpx 24rpx;
}
</style>
