<template>
  <view>
    <scroll-view class="page">
      <cu-custom bgColor="bg-blue" :isCustom="true">
        <block slot="backText">返回</block>
        <view slot="content">职员资料</view>
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
          <tui-input label="实名" borderTop :textRight="true" placeholder="姓名" v-model="userInfo.realName">
          </tui-input>
          <view class="cu-form-group">
            <view class="title">性别</view>
            <switch class="switch-sex" @change="updateGender" :class="userInfo.gender >= 1 ? 'checked' : false"
              :checked="userInfo.gender >= 1 ? true : false"></switch>
          </view>

          <tui-input arrow label="手机号" :lineLeft="false" :textRight="true" placeholder="手机号" v-model="userInfo.phone">
          </tui-input>
          <tui-input label="邮箱" :lineLeft="false" :textRight="true" placeholder="邮箱" v-model="userInfo.email">
          </tui-input>
          <tui-input label="QQ" :lineLeft="false" :textRight="true" placeholder="QQ" v-model="userInfo.qq">
          </tui-input>
          <tui-input label="微信" :lineLeft="false" :textRight="true" placeholder="微信" v-model="userInfo.wechat">
          </tui-input>
          <tui-input label="基础薪" :lineLeft="false" :textRight="true" type="digit" placeholder="基础薪资"
            :value="userInfo.base_salary" @input="inputBaseSalary">
            <template v-slot:right>
              <text>￥</text>
            </template>
          </tui-input>
        </tui-form>
        <view class="cu-item arrow" @tap="showPayCode">
          <view class="content">
            <text class="text-black">收款码</text>
          </view>
          <view class="action">
            <view class="cu-avatar radius sm over-hidden">
              <block v-if="userInfo.payQrcode">
                <image :src="userInfo.payQrcode" mode="widthFix"></image>
              </block>
              <block v-else> 无 </block>
            </view>
          </view>
        </view>
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
          staff_uid: "",
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
        nickNameForm: false,
        showNameForm: false,
        power: "",
        showPreviewImg: false,
        previewImgUrls: [{
          src: ""
        }],
      };
    },
    props: {},
    onLoad: function(options) {
      let staff_uid = options.staff_uid || "04aa829b-02aa-4b28-85b8-0e113c37c61a"
      this.getStaffInfo(staff_uid);
      this.power = uni.getStorageSync("power");
      // 获取临时签名 用于上传阿里云对象存储OSS
      this.getOssToken();
    },
    onReady: function() {},
    methods: {
      // 提交按钮
      async submit(e) {
        this.upadteStaff();
      },
      // 获取oss签名
      async getOssToken() {
        let ossSignatureUser = uni.getStorageSync("ossSignatureUser");
        let expire = new Date(ossSignatureUser.expire * 1000).getTime();
        let now = new Date().getTime();
        console.log((expire - now) / 1000);
        if (ossSignatureUser == "" || expire <= now) {
          // if (true) {
          await this.http.get("/oss/osstoken?dir=user", {}).then((res) => {
            console.log(res);
            if (res.code != 200) {
              this.showTips(res.msg, "warning");
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
      async upadteStaff() {
        let userInfo = {
          ...this.userInfo
        };
        for (let key in userInfo) {
          if (userInfo[key] == null) {
            // 不提交值为null的字段，不做修改
            delete userInfo[key];
          }
        }
        console.log(this.userInfo);
        this.loadingCpt(true, "请稍后...");
        userInfo.base_salary = parseInt(userInfo.base_salary)
        await this.http
          .post("/staff/info/update", {
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
              res.data.base_salary = String(res.data.base_salary)
              this.userInfo = res.data;
            }
            return res.data;
          });
        this.loadingCpt(false);
      },
      // 获取员工信息
      async getStaffInfo(staff_uid) {
        this.loadingCpt(true);
        console.log(staff_uid);
        await this.http
          .get("/staff/info", {
            data: {
              staff_uid: staff_uid,
            },
          })
          .then((res) => {
            if (res.code != 200) {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            } else {
              res.data.base_salary = String(res.data.base_salary)
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
                src: this.userInfo.avatar_url
              }];
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
                src: this.userInfo.payQrcode
              }];
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
      // 隐藏图片预览
      hidePreviewImg() {
        this.showPreviewImg = false;
      },
      inputBaseSalary(e) {
        if (e != "") {
          this.userInfo.base_salary = parseInt(e);
        } else {
          this.userInfo.base_salary = 0;
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
<style scoped>
  .cu-list.menu>.avatar {
    min-height: 150rpx;
  }
</style>
