<template>
  <view class="container">
    <!-- #ifdef MP -->
    <cu-custom bgColor="bg-transparent" :isCustom="true">
      <block slot="backText">返回</block>
    </cu-custom>
    <!-- #endif -->
    <!-- #ifndef MP -->
    <view class="tui-header">
      <view>优家登录</view>
      <tui-icon name="shut" :size="26" @click="back"></tui-icon>
    </view>
    <!-- #endif -->
    <view class="tui-page-title">注册</view>
    <view class="tui-form">
      <view class="tui-view-input">
        <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="voipphone" color="#6d7a87" :size="20"></tui-icon>
            <input :value="phone" placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number" maxlength="11"
              @input="inputMobile" />
            <view class="tui-icon-close" v-show="phone" @tap="clearInput(1)">
              <tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
            </view>
          </view>
        </tui-list-cell>
        <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="shield" color="#6d7a87" :size="20"></tui-icon>
            <input placeholder="请输入验证码" placeholder-class="tui-phcolor" type="text" maxlength="6" @input="inputCode" />
            <tui-countdown-verify :successVal="successVal" :resetVal="resetVal" @send="sendPhoneCode" color="#ffffff"
              background="var(--themeColor)" radius="50rpx"></tui-countdown-verify>
          </view>
        </tui-list-cell>
        <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
            <input :value="password" placeholder="请输入密码" :password="true" placeholder-class="tui-phcolor" type="text"
              maxlength="40" @input="inputPwd" />
            <view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
              <tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
            </view>
          </view>
        </tui-list-cell>
      </view>

      <view class="tui-btn-box">
        <tui-button :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle" @click="register">注册
        </tui-button>
      </view>
      <view class="tui-cell-text flex justify-end padding-bottom-0">
        <view hover-class="tui-opcity" :hover-stay-time="150">
          已有账号？
          <text class="tui-color-primary" @tap="href(3)">登录</text>
        </view>
      </view>

      <view class="tui-cell-text">
        注册代表同意
        <view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol">
          优家用户服务协议、隐私政策</view>
      </view>
    </view>

    <!-- 用户协议 -->
    <tui-dialog :buttons="buttons" :show="showProtocol" title="协议" @close="close" @click="protocol">
      <template v-slot:content>
        <view class="tui-text">
          用户在使用优家应用（以下简称"优家"）提供的网络服务前有义务仔细阅读本协议。用户在此不可撤销地承诺，若其使用优家提供的网络服务，将视为用户同意并接受本协议全部条款的约束，此后用户无权以未阅读本协议或对本协议有任何误解为由，主张本协议无效或要求撤销本协议。
        </view>
        <view class="tui-text">
          第一条、保护用户个人信息是一项基本原则，我们将会采取合理的措施保护用户的个人信息。除法律法规规定的情形外，未经用户许可我们不会向第三方公开、透漏个人信息。APP对相关信息采用专业加密存储与传输方式，保障用户个人信息安全，如果您选择同意使用APP软件，
          即表示您认可并接受APP服务条款及其可能随时更新的内容。
        </view>
        <view class="tui-text">
          第二条、我们将会使用您的以下功能：麦克风、喇叭、WIFI网络、蜂窝通信网络、手机基站数据、SD卡、短信控制、通话权限、蓝牙管理，如果您禁止APP使用以上相关服务和功能，您将自行承担不能获得或享用APP相应服务的后果。
        </view>
        <view class="tui-text">
          第三条、为了提供更好的客户服务，基于技术必要性收集一些有关设备级别事件（例如崩溃）的信息，但这些信息并不能够让我们识别您的
          身份。为了能够让APP定位服务更精确，可能会收集并处理有关您实际所在位置信息（例如移动设备发送的GPS信号），WI-FI接入点和
          基站位置信息。我们将对上述信息实施技术保护措施，以最大程度保护这些信息不被第三方非法获得，同时，您可以自行选择拒绝我们基于技术必要性
          收集的这些信息，并自行承担不能获得或享用APP相应服务的后果。
        </view>
        <view class="tui-text">
          第四条、在您使用我们的产品或服务的过程中，我们可能：需要您提供个人信息，如姓名、电子邮件地址、电话号码、联系地址等以及注册或申请服务时需要
          的其它类似个人信息；您对我们的产品和服务使用即表明您同意我们对这些信息的收集和合理使用。您可以自行选择拒绝、放弃使用相关产品或服务。
        </view>
        <view class="tui-text">
          第五条、由于您的自身行为或不可抗力等情形，导致上述可能涉及您隐私或您认为是私人信息的内容发生被泄露、批漏，或被第三方获取、使用、转让等情形的，均由您自行承担不利后果，我们对此不承担任何责任。
        </view>
        <view class="tui-text">
          第六条、您仅在符合优家使用目的的前提下被许可浏览和使用优家，即以个人名义浏览信息。其他方式的使用都是被严格禁止的，包括但不限于以下方式：修改、销售、传送、再版、删除、添加、展览、记入或演示优家的内容或以其他方式部分地或整体地非法使用优家的内容。
        </view>
        <view class="tui-text"> 第七条、我们拥有对上述条款的最终解释权。 </view>
      </template>
    </tui-dialog>
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
    computed: {
      disabled: function() {
        let bool = true;
        if (this.phone && this.verify_code && this.password) {
          bool = false;
        }
        return bool;
      },
    },
    data() {
      return {
        showloading: false,
        loadingText: "加载中...",
        tipsColor: "warning",
        tipsPosition: "top",
        phone: "",
        password: "",
        verify_code: "",
        step: 0,
        isSend: true,
        btnSendText: "获取验证码", //倒计时格式：(60秒)
        buttons: [{
          text: "确定",
          color: "#0081ff",
        }, ],
        showProtocol: false,
        successVal: 0,
        resetVal: 0,
      };
    },
    methods: {
      async register() {
        this.loadingCpt(true);
        await this.http
          .post("/user/register", {
            data: {
              phone: this.phone,
              verify_code: this.verify_code,
              register_type: "phone",
              step: 1,
              password: this.$md5(this.$md5(this.password)),
              confirm_password: this.$md5(this.$md5(this.password)),
            },
          })
          .then((res) => {
            if (res.code == 200) {
              uni.showToast({
                title: "注册成功，请稍后",
                mask: true,
              });
              setTimeout(() => {
                uni.navigateTo({
                  url: "/pages/login/login"
                });
              }, 1500);
            } else {
              this.showTips(res.msg, "warning");
            }
            console.log(res);
          });
        this.loadingCpt(false);
      },
      // 发送验证码
      sendPhoneCode() {
        this.http
          .post("/user/register", {
            data: {
              phone: this.phone,
              verify_code: this.verify_code,
              register_type: "phone",
              step: 0,
              password: this.$md5(this.$md5(this.password)),
              confirm_password: this.$md5(this.$md5(this.password)),
            },
          })
          .then((res) => {
            if (res.code != 200) {
              this.showTips(res.msg, "warning");
              this.resetVal += 1;
            } else {
              this.successVal += 1;
            }
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            this.resetVal += 1;
          });
      },
      back() {
        uni.navigateBack();
      },
      inputCode(e) {
        this.verify_code = e.detail.value;
      },
      inputMobile: function(e) {
        this.phone = e.detail.value;
      },
      inputPwd: function(e) {
        this.password = e.detail.value;
      },
      clearInput(type) {
        if (type == 1) {
          this.phone = "";
        } else {
          this.password = "";
        }
      },
      protocol() {
        this.showProtocol = !this.showProtocol;
      },
      href(type) {
        let url = "/pages/forgetPwd/forgetPwd";
        if (type == 2) {
          url = "/pages/reg/reg";
        } else if (type == 3) {
          url = "/pages/login/login";
        }
        this.tui.href(url);
      },

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
    .tui-status-bar {
      width: 100%;
      height: var(--status-bar-height);
    }

    .tui-header {
      width: 100%;
      padding: 40rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .tui-page-title {
      width: 100%;
      font-size: 48rpx;
      font-weight: bold;
      color: $uni-text-color;
      line-height: 42rpx;
      padding: 110rpx 40rpx 40rpx 40rpx;
      box-sizing: border-box;
    }

    .tui-text {
      font-size: $uni-font-size-sm;
      text-indent: 2em;
      color: $uni-text-color;
      padding-bottom: $uni-spacing-col-sm;
      text-align: left;
    }

    .tui-form {
      padding-top: 50rpx;

      .tui-view-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0 40rpx;

        .tui-cell-input {
          width: 100%;
          display: flex;
          align-items: center;
          padding-top: 48rpx;
          padding-bottom: $uni-spacing-col-base;

          input {
            flex: 1;
            padding-left: $uni-spacing-row-base;
          }

          .tui-icon-close {
            margin-left: auto;
          }
        }
      }

      .tui-cell-text {
        width: 100%;
        padding: 40rpx $uni-spacing-row-lg;
        box-sizing: border-box;
        font-size: $uni-font-size-sm;
        color: $uni-text-color-grey;
        display: flex;
        align-items: center;

        .tui-color-primary {
          color: $uni-color-primary;
          padding-left: $uni-spacing-row-sm;
        }
      }

      .tui-btn-box {
        width: 100%;
        padding: 0 $uni-spacing-row-lg;
        box-sizing: border-box;
        margin-top: 80rpx;
      }
    }
  }
</style>
