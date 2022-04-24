<template>
  <view>
    <cu-custom bgColor="bg-blue" :isBack="true">
      <view slot="backText">返回</view>
      <view slot="content">申请列表</view>
    </cu-custom>

    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
        <span class="iconfont icon-renyuan text-blue padding-right-sm"></span>
        所有申请
      </view>
    </view>
    <block v-if="!ShowNodata">
      <view class="cu-list menu-avatar">
        <view v-for="(item, index) in userList" :key="index" :data-uuid="item.uuid" class="cu-item"
          @click="showApplyModal">
          <view class="cu-avatar round lg bg-white" style="height: auto; overflow: hidden">
            <image :src="item.avatar_url ? item.avatar_url : '无'" mode="widthFix">
            </image>
          </view>
          <view class="content">
            <view class="text-grey">
              <text class="text-cut">{{item.nickname ? item.nickname : "未设置昵称"}}</text>
            </view>
            <view class="text-gray text-sm flex">
              <text class="text-cut">{{ item.phone ? item.phone : "手机号异常" }}</text>
            </view>
          </view>
        </view>
      </view>
    </block>

    <block v-else="">
      <view class="flex align-center justify-center" :style="'margin-top:' + 18 + 'rpx'">
        <img mode="widthFix" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
      </view>
    </block>
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
        userList: [],
        modalName: "",
        keyword: "",
        page: 0,
        pageSize: 20,
        ShowNodata: false,
        href: "",
      };
    },
    onLoad: function(option) {
      this.href = option.href;
      this.getAllUsers();
    },
    onReady: function() {},
    onShow: function() {
      this.getAllUsers();
    },
    methods: {
      async getAllUsers() {
        this.loadingCpt(true);
        await this.http
          .get("/user/auth_apply/list", {
            data: {
              keyword: this.keyword,
              page: this.page,
              pageSize: this.pageSize,
            },
          })
          .then((res) => {
            console.log(res.data);
            console.log(res.data.length);
            this.userList = res.data.item;
            this.ShowNodata = res.data.item.length ? false : true;
            return res.data.item;
          });
        this.loadingCpt(false);
      },
      inputKeyword(e) {
        this.keyword = e.value;
      },
      clearKeyword() {
        this.keyword = "";
        this.getAllUsers();
      },

      showApplyModal(e) {
        console.log(e);
        let uuid = e.currentTarget.dataset.uuid;
        uni.showModal({
          content: "是否通过申请？",
          success: (res) => {
            if (res.confirm) {
              this.applyOperate(uuid, 1);
            } else if (res.cancel) {
              this.applyOperate(uuid, 2);
            }
          },
        });
      },
      async applyOperate(uuid, operate) {
        this.loadingCpt(true);
        await this.http
          .post("/user/auth/manage", {
            data: {
              uuid: uuid,
              operate: operate,
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
        this.loadingCpt(false);
        this.getAllUsers();
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
</style>
