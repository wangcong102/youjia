<template>
  <scroll-view :scroll-y="modalName == null" :class="'page ' + (modalName != null ? 'show' : '')">
    <cu-custom bgColor="bg-blue" :isBack="true">
      <view slot="backText">返回</view>
      <view slot="content">授权管理</view>
    </cu-custom>
    <tui-searchbar radius="20px" placeholder="按姓名搜索" :value="keyword" @search="getAllUsers" @cancel="getAllUsers"
      @clear="clearKeyword" @input="inputKeyword" padding="6px 8px" height="26px"></tui-searchbar>

    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
        <span class="iconfont icon-renyuan text-blue padding-right-sm"></span>
        所有员工
      </view>
    </view>
    <block v-if="!ShowNodata">
      <view class="cu-list menu-avatar">
        <navigator v-for="(item, index) in userList" :key="index" class="cu-item"
          :url="'/pages/'+href+'/'+href+'?staff_uid=' + item.staff_uid">
          <view class="cu-avatar round lg bg-white" style="height: auto; overflow: hidden">
            <image :src="item.avatar_url ? item.avatar_url : '无'" mode="widthFix">
            </image>
          </view>
          <view class="content">
            <view class="text-grey">
              <text class="text-cut">{{ item.realName ? item.realName : "未设置实名" }}</text>
            </view>
            <view class="text-gray text-sm flex">
              <text class="text-cut">{{
                item.nickname ? item.nickname : "未设置昵称"
              }}</text>
            </view>
          </view>
        </navigator>
      </view>
    </block>

    <block v-else="">
      <view class="flex align-center justify-center" :style="'margin-top:' + 18 + 'rpx'">
        <img mode="widthFix" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
      </view>
    </block>
  </scroll-view>
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
        uni.showLoading();
        await this.http
          .get("/staff/info/list", {
            data: {
              keyword: this.keyword,
              page: this.page,
              pageSize: this.pageSize,
            },
          })
          .then((res) => {
            console.log(res.data);
            console.log(res.data.length);
            this.userList = res.data;
            this.ShowNodata = res.data.length ? false : true;
            return res.data;
          });
        uni.hideLoading();
      },
      inputKeyword(e) {
        this.keyword = e.value;
      },
      clearKeyword() {
        this.keyword = "";
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
  /* pages/allUser/index.wxss */
</style>
