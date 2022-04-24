<template>
  <view class="container">
    <view class="tui-page-title">找回密码</view>
    <view class="tui-form">
      <view class="tui-view-input">
        <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="voipphone" color="#6d7a87" :size="20"></tui-icon>
            <input placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number" maxlength="11"
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
            <input :value="password" placeholder="请输入新密码" :password="true" placeholder-class="tui-phcolor" type="text"
              maxlength="40" @input="inputPwd" />
            <view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
              <tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
            </view>
          </view>
        </tui-list-cell>
        <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
          <view class="tui-cell-input">
            <tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
            <input :value="confirm_password" placeholder="再次输入新密码" :password="true" placeholder-class="tui-phcolor"
              type="text" maxlength="40" @input="inputConfirmPwd" />
            <view class="tui-icon-close" v-show="confirm_password" @tap="clearInput(3)">
              <tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
            </view>
          </view>
        </tui-list-cell>
      </view>
      <view class="tui-btn-box">
        <tui-button :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle" @click="changePwd">确认修改
        </tui-button>
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
    computed: {
      disabled: function() {
        let bool = true;
        if (
          this.phone &&
          this.verify_code &&
          this.password &&
          this.confirm_password
        ) {
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
        confirm_password: "",
        verify_code: "",
        step: 0,
        isSend: true,
        btnSendText: "获取验证码", //倒计时格式：(60秒)
        buttons: [{
          text: "确定",
          color: "#0081ff",
        }, ],
        successVal: 0,
        resetVal: 0,
      };
    },
    methods: {
      async changePwd() {
        if (this.password != this.confirm_password) {
          uni.showToast({
            title: "两次密码不一致",
            icon: "none",
          });
        } else {
          uni.showLoading({
            title: "请稍后",
            mask: true,
          });
          await this.http
            .post("/user/password/modify", {
              data: {
                phone: this.phone,
                verify_code: this.verify_code,
                modify_type: "phone",
                step: 1,
                password: this.$md5(this.$md5(this.password)),
              },
            })
            .then((res) => {
              if (res.code == 200) {
                uni.showToast({
                  title: "修改成功，请登录",
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
          setTimeout(() => {
            uni.hideLoading();
          }, 1500);
        }
      },
      async sendPhoneCode() {
        await uni.showLoading({
          title: "请稍后",
          mask: true,
        });
        this.http
          .post("/user/password/modify", {
            data: {
              phone: this.phone,
              verify_code: this.verify_code,
              modify_type: "phone",
              step: 0,
              password: this.$md5(this.$md5(this.password)),
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
        uni.hideLoading();
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
      inputConfirmPwd: function(e) {
        this.confirm_password = e.detail.value;
      },
      clearInput(type) {
        if (type == 1) {
          this.phone = "";
        } else if (type == 2) {
          this.password = "";
        } else if (type == 3) {
          this.confirm_password = "";
        }
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

<style lang="scss">
  .container {
    .tui-page-title {
      width: 100%;
      font-size: 48rpx;
      font-weight: bold;
      color: $uni-text-color;
      line-height: 42rpx;
      padding: 110rpx 40rpx 40rpx 40rpx;
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

          .tui-btn-send {
            width: 156rpx;
            text-align: right;
            flex-shrink: 0;
            font-size: $uni-font-size-base;
            color: $uni-color-primary;
          }

          .tui-gray {
            color: $uni-text-color-placeholder;
          }
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
