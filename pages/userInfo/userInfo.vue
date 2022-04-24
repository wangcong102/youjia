<template>
  <view>
    <scroll-view class="page">
      <cu-custom bgColor="bg-blue" :isCustom="true">
        <block slot="backText">返回</block>
        <view slot="content">个人资料</view>
      </cu-custom>

      <view class="cu-list menu">
        <view class="cu-item padding-tb avatar" @tap="showAvatar">
          <view class="content">
            <text class="text-black">头像</text>
          </view>
          <view class="action">
            <view class="cu-avatar round lg over-hidden">
              <image :src="userInfo.avatar_url" mode="widthFix"></image>
            </view>
          </view>
        </view>
        <tui-form ref="form" :model="userInfo" tipRidus=" 0 0 12rpx 12rpx">
          <tui-input label="昵称" borderTop :textRight="true" placeholder="昵称" v-model="userInfo.nickname">
          </tui-input>

          <view class="cu-form-group">
            <view class="title">性别</view>
            <switch class="switch-sex" @change="updateGender" :class="userInfo.gender >= 1 ? 'checked' : false"
              :checked="userInfo.gender >= 1 ? true : false"></switch>
          </view>
          <tui-input arrow label="手机号" :lineLeft="false" :textRight="true" disabled placeholder="手机号"
            v-model="userInfo.phone">
            <template v-slot:right>
              <span class="iconfont icon-arrow1 text-gray"></span>
            </template>
          </tui-input>
          <tui-input label="邮箱" :lineLeft="false" :textRight="true" disabled placeholder="邮箱" v-model="userInfo.email">
            <template v-slot:right>
              <span class="iconfont icon-arrow1 text-gray"></span>
            </template>
          </tui-input>
          <tui-input label="QQ" :lineLeft="false" :textRight="true" placeholder="QQ" v-model="userInfo.qq">
          </tui-input>
          <tui-input label="微信" :lineLeft="false" :textRight="true" placeholder="微信" v-model="userInfo.wechat">
          </tui-input>
          <tui-input label="绑定微信" :lineLeft="false" :textRight="true" disabled
            placeholderStyle="color:var(--themeColor)">
            <template v-slot:right>
              <view class="text-blue" v-if="userInfo.bind_wechat" @click="changeBindWechat">已绑定</view>
              <view class="text-blue" v-else @click="changeBindWechat">绑定微信</view>
            </template>
          </tui-input>
        </tui-form>
        <view class="padding-lg"></view>
        <view class="flex justify-center">
          <tui-button width="400rpx" height="84rpx" bold @click="submit">提交</tui-button>
        </view>
      </view>
    </scroll-view>
    <!-- 图片预览 -->
    <tui-gallery :urls="previewImgUrls" :show="showPreviewImg" @hide="hidePreviewImg"></tui-gallery>

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
  import {
    upload
  } from "../../utils/upload.js";
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
          payQrcode: "",
        },
        power: "",
        showPreviewImg: false,
        previewImgUrls: [{
          src: "",
        }, ],
      };
    },
    props: {},
    onLoad: function(options) {
      this.getUserInfo(options.uuid);
      this.power = uni.getStorageSync("power");
      // 获取临时签名 用于上传阿里云对象存储OSS
      this.getOssToken();
    },
    onReady: function() {},
    methods: {
      // 提交按钮
      async submit(e) {
        this.upadteUser();
      },
      // 获取oss签名
      getOssToken() {
        let ossSignatureUser = uni.getStorageSync("ossSignatureUser");
        let expire = new Date(ossSignatureUser.expire * 1000).getTime();
        let now = new Date().getTime();
        console.log((expire - now) / 1000);
        if (ossSignatureUser == "" || expire <= now) {
          // if (true) {
          this.http.get("/oss/osstoken?dir=user", {}).then((res) => {
            console.log(res);
            if (res.code != 200) {
              this.showTips(res.msg, "warning", "center");
            } else {
              this.ossSignatureUser = res.data;
              uni.setStorageSync("ossSignatureUser", res.data);
            }
            return res.data;
          });
        } else {
          console.log("ossSignature尚未过期");
          this.ossSignatureUser = ossSignatureUser;
          return ossSignatureUser;
        }
      },
      // 执行更新
      async upadteUser() {
        let userInfo = {
          ...this.userInfo,
        };
        for (let key in userInfo) {
          if (userInfo[key] == null) {
            // 不提交值为null的字段，不做修改
            delete userInfo[key];
          }
        }
        console.log(this.userInfo);
        this.loadingCpt(true, "请稍后...");
        await this.http
          .post("/user/account/update", {
            data: {
              ...userInfo,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.code != 200) {
              uni.showToast({
                title: res.msg,
              });
            } else {
              this.showTips("修改成功", "success", "center", 800);
              this.userInfo = res.data;
              uni.setStorageSync("userInfo", this.userInfo);
            }
            return res.data;
          });
        this.loadingCpt(false);
      },

      // 获取个人信息
      async getUserInfo(uuid) {
        this.loadingCpt(true);
        console.log(uuid);
        await this.http
          .get("/user/account", {})
          .then((res) => {
            if (res.code != 200) {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            } else {
              res.data.base_salary = String(res.data.base_salary);
              this.userInfo = res.data;
            }
            return res.data;
          });
        this.loadingCpt(false);
      },
      // 职员头像相关 预览 修改
      async showAvatar() {
        uni.showActionSheet({
          itemList: ["查看头像", "修改头像"],
          success: (res) => {
            console.log("选中了第" + (res.tapIndex + 1) + "个按钮");
            if (res.tapIndex == 0) {
              this.previewImgUrls = [{
                src: this.userInfo.avatar_url,
              }, ];
              this.showPreviewImg = true;
            } else {
              // 上传头像相关
              uni.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                sourceType: ["album", "camera"],
                success: (res) => {
                  console.log(res);
                  this.UploadNum = this.UploadNum + res.tempFilePaths.length;

                  /* #ifdef H5 */
                  let filePath = res.tempFilePaths[0];
                  let fileName = res.tempFiles[0].name;
                  /* #endif */

                  /* #ifdef MP */
                  let filePath = res.tempFilePaths[0];
                  let fileName = res.tempFilePaths[0];
                  /* #endif */
                  console.log(res.tempFilePaths[0]);
                  console.log(res.tempFiles[0].name);

                  upload({
                      FileUrl: filePath,
                      fileName: fileName,
                      fileType: "image",
                      basePath: "user/" + this.userInfo.uuid + "/",
                      ossSignature: this.getOssToken(),
                    })
                    .then((res) => {
                      console.log(res);
                      this.userInfo.avatar_url = res;
                      this.UploadNum = this.UploadNum - 1;
                    })
                    .catch((err) => {
                      console.log(err);
                      uni.showToast({
                        title: "网络似乎出现问题",
                        icon: "none",
                        mask: true,
                        duration: 2000,
                      });
                    });
                },
              });
            }
          },
          fail: function(res) {
            console.log(res.errMsg);
          },
        });
      },

      updateGender(e) {
        let value = e.detail.value;
        this.userInfo.gender = value ? 1 : 0;
        console.log(value);
        console.log(this.userInfo.gender);
      },
      // 职员收款码相关 预览 修改
      showPayCode() {
        uni.showActionSheet({
          itemList: ["查看收款码", "修改收款码"],
          success: (res) => {
            console.log("选中了第" + (res.tapIndex + 1) + "个按钮");

            if (res.tapIndex == 0) {
              this.previewImgUrls = [{
                src: this.userInfo.payQrcode,
              }, ];
              this.showPreviewImg = true;
            } else {
              // 上传收款码
              uni.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                sourceType: ["album", "camera"],
                success: (res) => {
                  console.log(res);
                  this.UploadNum = this.UploadNum + res.tempFilePaths.length;

                  for (let i = 0; i < res.tempFilePaths.length; i++) {
                    /* #ifdef H5 */
                    let filePath = res.tempFilePaths[i];
                    let fileName = res.tempFiles[i].name;
                    /* #endif */

                    /* #ifdef MP */
                    let filePath = res.tempFilePaths[i];
                    let fileName = res.tempFilePaths[i];
                    /* #endif */
                    console.log(res.tempFilePaths[i]);
                    console.log(res.tempFiles[i].name);

                    upload({
                        FileUrl: filePath,
                        fileName: fileName,
                        fileType: "image",
                        basePath: "user/" + this.userInfo.uuid + "/",
                        ossSignature: this.getOssToken(),
                      })
                      .then((res) => {
                        console.log(res);
                        this.userInfo.payQrcode = res;
                        this.UploadNum = this.UploadNum - 1;
                      })
                      .catch((err) => {
                        console.log(err);
                        uni.showToast({
                          title: "网络似乎出现问题",
                          icon: "none",
                          mask: true,
                          duration: 2000,
                        });
                      });
                  }
                },
              });
            }
          },
          fail: function(res) {
            console.log(res.errMsg);
          },
        });
      },
      async changeBindWechat() {
        console.log(123)
        // #ifdef MP
        uni.login({
          success: (res) => {
            if (res.code) {
              let js_code = res.code;
              this.loadingCpt(true)
              this.http
                .post("/user/account/bindWechat", {
                  data: {
                    js_code: res.code
                  },
                })
                .then((res) => {
                  if (res.code == 200) {
                    this.showTips(res.msg, 'success', 'center')
                    this.userInfo.bind_wechat = true
                  } else {
                    this.showTips(res.msg, 'warning', 'center')
                  }
                  this.loadingCpt(false)
                });
            } else {
              console.log("绑定失败！" + res.errMsg);
            }
          },
        });
        // #endif
      },
      // 隐藏图片预览
      hidePreviewImg() {
        this.showPreviewImg = false;
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
<style scoped>
  .cu-list.menu>.avatar {
    min-height: 150rpx;
  }
</style>
