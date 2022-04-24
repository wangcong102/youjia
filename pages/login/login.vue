<template>
  <view class="container">
    <!-- #ifdef MP -->
    <cu-custom bgColor="bg-transparent" :isCustom="true">
      <block slot="backText">返回</block>
    </cu-custom>
    <!-- #endif -->
    <!-- #ifndef MP -->
    <view class="tui-status-bar"></view>
    <view class="tui-header">
      <view>优家登录</view>
      <tui-icon name="shut" :size="26" @click="back"></tui-icon>
    </view>
    <!-- #endif -->
    <view class="tui-page-title">登录</view>
    <view class="tui-form">
      <view class="tui-view-input">
        <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="voipphone" color="#6d7a87" :size="20"></tui-icon>
            <input :adjust-position="false" :value="phone" placeholder="请输入手机号" placeholder-class="tui-phcolor"
              type="number" maxlength="11" @input="inputMobile" />
            <view class="tui-icon-close" v-show="phone" @tap="clearInput(1)">
              <tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
            </view>
          </view>
        </tui-list-cell>
        <tui-list-cell v-if="login_type=='phoneCode'" :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="shield" color="#6d7a87" :size="20"></tui-icon>
            <input placeholder="请输入验证码" placeholder-class="tui-phcolor" type="text" maxlength="6" @input="inputCode"
              :value="verify_code" @confirm="login(login_type)" />
            <tui-countdown-verify :successVal="successVal" :resetVal="resetVal" @send="sendPhoneCode" color="#ffffff"
              background="var(--themeColor)" radius="50rpx"></tui-countdown-verify>
          </view>
        </tui-list-cell>
        <tui-list-cell v-if="login_type=='phonePwd'" :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
            <input :adjust-position="false" :value="password" placeholder="请输入密码" :password="true"
              placeholder-class="tui-phcolor" type="text" maxlength="36" @input="inputPwd"
              @confirm="login(login_type)" />
            <view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
              <tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
            </view>
          </view>
        </tui-list-cell>
      </view>

      <view class="tui-cell-text">
        <view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="href(1)">忘记密码？
        </view>
        <view hover-class="tui-opcity" :hover-stay-time="150">
          没有账号？
          <text class="tui-color-primary" @tap="href(2)">注册</text>
        </view>
      </view>
      <view class="tui-btn-box">
        <tui-button :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle" type="primary"
          :preventClick="true" @click="login(login_type)">登录</tui-button>
      </view>
      <view class="tui-cell-text margin-top-lg">
        登录代表同意
        <view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol">
          优家用户服务协议、隐私政策</view>
      </view>
    </view>
    <view class="tui-login-way" v-if="!popupShow">
      <view hover-class="tui-opcity" :hover-stay-time="150" @tap="showOtherLogin">其他方式登录</view>
    </view>
    <tui-bottom-popup :mask="false" backgroundColor="transparent" :show="popupShow">
      <view class="tui-auth-login">
        <!-- #ifdef APP-PLUS || MP-WEIXIN-->
        <view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150" @click="changeLoginType"
          data-login_type="wechat">
          <!-- <button open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" style="padding: 0;">
            <image src="/static/icon/wechat.png" class="tui-login-logo flex align-center justify-center"></image>
          </button> -->
          <button @click="getUserProfile" style="padding: 0;">
            <image src="/static/icon/wechat.png" class="tui-login-logo flex align-center justify-center">
            </image>
          </button>

        </view>
        <!-- #endif -->
        <!-- #ifndef MP -->
        <view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150" @click="changeLoginType"
          data-login_type="qq">
          <image src="/static/icon/qq.png" class="tui-login-logo"></image>
        </view>
        <!-- #endif -->
        <view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150" @click="changeLoginType"
          data-login_type="phoneCode">
          <image src="/static/icon/verify_code.png" class="tui-login-logo"></image>
        </view>
        <view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150" @click="changeLoginType"
          data-login_type="phonePwd">
          <image src="/static/icon/password.png" class="tui-login-logo"></image>
        </view>

      </view>
    </tui-bottom-popup>

    <tui-modal :show="showBondPhoneModal" custom>
      <view class="tui-modal-custom">
        <view class="padding-tb">
          <view class="tui-modal-custom-text text-xl text-center">绑定手机号</view>
          <view class="tui-modal-custom-text text-center padding-tb">是否现在绑定手机号码？</view>
        </view>
        <view class="flex flex-wrap">
          <tui-button class="flex-sub padding-lr" plain height="72rpx" :size="28" type="blue" shape="circle"
            @click="hiddenBondPhoneModal">取消</tui-button>
          <tui-button class="flex-sub padding-lr" height="72rpx" :size="28" type="blue" shape="circle"
            open-type="getPhoneNumber" @getphonenumber="bindPhoneNumber">确定</tui-button>
        </view>

      </view>
    </tui-modal>

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
    <!-- 申请权限提示 -->
    <tui-modal :show="showApplyJobModal" title="当前没有权限" content="是否现在申请入职？" :button="applyJobButton" @click="applyJob"
      color="#333" :size="32"></tui-modal>

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
        if ((this.phone && this.password) || (this.phone && this.verify_code)) {
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
        login_type: "phoneCode",
        popupShow: true,
        showApplyJobModal: false,
        applyJobButton: [{
            text: "取消",
            type: "primary",
            plain: true,
          },
          {
            text: "申请",
            type: "primary",
            plain: false,
          },
        ],
        resetVal: 0,
        successVal: 0,
        verify_code: "",
        js_code: "",
        userInfo: {},
        encryptedData: {},
        iv: "",
        showBondPhoneModal: false,
        showProtocol: false,
        buttons: [{
          text: "确定",
          color: "#0081ff",
        }, ],
      };
    },
    onLoad(options) {
      let source = options.source; //原页面：从哪一个页面跳转过来
      this.phone = uni.getStorageSync("phone");
      this.password = uni.getStorageSync("password");
      this.token = uni.getStorageSync("token");
      if (this.token) {
        // uni.switchTab({
        //   url: "/pages/index/index",
        // });
      }
      if (!source) {
        //source为空则无跳转
        if (this.phone != "" && this.password != "") {
          // this.login("phonePwd");
        }
      }
    },
    methods: {
      //绑定手机号码
      async login(type) {
        this.loadingCpt(true);
        if (type == "phoneCode") {
          var data = {
            phone: this.phone,
            login_type: type,
            step: 1,
            verify_code: this.verify_code,
            showloading: true,
          };
        } else if (type == "phonePwd") {
          var data = {
            phone: this.phone,
            password: this.$md5(this.$md5(this.password)),
            login_type: type,
            step: 0,
            verify_code: this.verify_code,
            showloading: true,
          };
        } else if (type == "wechat") {
          var data = {
            login_type: type,
            js_code: this.js_code,
            encryptedData: this.encryptedData,
            iv: this.iv,
            showloading: true,
          };
        } else if (type == "qq") {}
        await this.http
          .post("/user/login", {
            data: {
              ...data,
            },
          })
          .then((res) => {
            console.log(res.code)
            if (res.code == 200) {
              let phone = res.data.userInfo.phone
              uni.setStorageSync("token", res.data.token);
              uni.setStorageSync("exp", res.data.exp);
              let role2Code = this.utils.role2Code;
              let role = res.data.userInfo.role
              if (role2Code(role) < role2Code('staff_member')) {
                this.showApplyJobModal = true
                // 没有绑定手机号提示
              } else {
                this.showBondPhoneModal = phone ? false : true
                uni.setStorageSync("phone", this.phone);
                uni.setStorageSync("password", this.password);
                uni.setStorageSync("userInfo", res.data.userInfo);
                this.showTips(res.msg, "success", "bottom");
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/index/index?from=login",
                  });
                }, 800);
              }
            } else {
              this.showTips(res.msg, "warning");
            }
          })
          .catch((err) => {
            console.log(err);
          });
        this.loadingCpt(false);
      },
      back() {
        uni.switchTab({
          url: "/pages/index/index",
        });
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
      href(type) {
        let url = "/pages/forgetPwd/forgetPwd";
        if (type == 2) {
          url = "/pages/reg/reg";
        }
        this.tui.href(url);
      },
      async applyJob(e) {
        let index = e.index;
        if (index == 0) {
          this.showApplyJobModal = false;
          this.showTips("抱歉您暂时还没有权限使用此系统！", "warnning")
        } else if (index == 1) {
          this.loadingCpt(true)
          await this.http
            .post("/user/auth/apply", {
              data: {
                remarks: "",
              },
            })
            .then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.showTips(res.msg, "success", "center");
              } else {
                this.showTips(res.msg, "warning", "center");
              }
            });
          this.loadingCpt(false)
          this.showApplyJobModal = false;
        }
      },
      // 修改用户登录方式
      changeLoginType(e) {
        let {
          login_type
        } = e.currentTarget.dataset;
        if (login_type == "phoneCode" || login_type == "phonePwd") {
          this.login_type = login_type;
        } else if (login_type == "wechat") {
          /* #ifdef MP-WEIXIN */
          wx.login({
            success: (res) => {
              if (res.code) {
                console.log(res.code);
                this.js_code = res.code;
              } else {
                console.log("登录失败！" + res.errMsg);
              }
            },
          });
          /* #endif */
        }
      },
      // 发送验证码
      sendPhoneCode() {
        let reg = /^\d{11}/g;
        if (!reg.test(this.phone)) {
          this.showTips("输入正确的手机号", "warning");
          this.resetVal += 1;
          return false;
        }
        this.http
          .post("/user/login", {
            data: {
              phone: this.phone,
              verify_code: this.verify_code,
              login_type: "phoneCode",
              step: 0,
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
      inputCode(e) {
        this.verify_code = e.detail.value;
      },
      getUserProfile(e) {
        this.loadingCpt(true);
        uni.getUserProfile({
          desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res);
            this.encryptedData = res.encryptedData;
            this.iv = res.iv;
            this.login("wechat");
            this.loadingCpt(false);
          },
          fail: (err) => {
            this.showTips("您拒绝了登录", "warning");
            console.log(err);
            this.loadingCpt(false);
          },
        });
      },
      // 绑定手机号
      async bindPhoneNumber(e) {
        console.log(e);
        if (e.errMsg == "getPhoneNumber:ok") {
          this.loadingCpt(true);
          await this.http
            .post("/user/account/bindPhone", {
              data: {
                encryptedData: e.encryptedData,
                iv: e.iv,
                // js_code: this.js_code,
                // 微信登录code因为前面已经登录过，session_key也已经获取到存在后端，不需要再次通过js_code获取
              },
            })
            .then((res) => {
              console.log(res);
              if (res.code == 200) {
                console.log(res);
                this.showTips(res.msg, "success");
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/index/index?from=login",
                  });
                }, 500);
              } else {
                this.showTips(res.msg, "warning");
              }
            })
            .catch((err) => {
              console.log(err);
            });
          this.loadingCpt(false);
        } else {
          this.showTips("您取消了绑定手机号码", "warning");
          return false;
        }
      },
      //隐藏绑定手机号提示框
      hiddenBondPhoneModal() {
        this.showBondPhoneModal = false;
        this.loadingCpt(true);
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/index/index?from=login",
          });
        }, 1000);
      },
      showOtherLogin() {
        //打开后 不再关闭
        this.popupShow = true;
      },
      protocol() {
        this.showProtocol = !this.showProtocol;
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
          duration: duration,
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
      padding: 40rpx;
      box-sizing: border-box;
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
        padding: $uni-spacing-col-lg $uni-spacing-row-lg;
        box-sizing: border-box;
        font-size: $uni-font-size-sm;
        color: $uni-text-color-grey;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tui-color-primary {
          color: $uni-color-primary;
        }
      }

      .tui-btn-box {
        width: 100%;
        padding: 0 $uni-spacing-row-lg;
        box-sizing: border-box;
        margin-top: 80rpx;
      }
    }

    .tui-login-way {
      width: 100%;
      font-size: 26rpx;
      color: $uni-color-primary;
      display: flex;
      justify-content: center;
      position: fixed;
      left: 0;
      bottom: 80rpx;

      view {
        padding: 12rpx 0;
      }
    }

    .tui-auth-login {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 80rpx;
      padding-top: 20rpx;

      .tui-icon-platform {
        width: 90rpx;
        height: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-left: 40rpx;

        &::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          transform-origin: 0 0;
          transform: scale(0.5, 0.5) translateZ(0);
          box-sizing: border-box;
          left: 0;
          top: 0;
          border-radius: 180rpx;
          border: 1rpx solid $uni-text-color-placeholder;
        }
      }

      .tui-login-logo {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
</style>
