<template>
  <view class="container">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <view slot="content"> 收藏夹 </view>
    </cu-custom>

    <view class="cu-bar bg-white search padding-0">
      <view class="search-form radius">
        <text class="cuIcon-search"></text>
        <input type="text" placeholder="搜索" confirm-type="search" @confirm="search" @input="inputKeyWord" />
      </view>
    </view>
    <view class="tui-product-list">
      <view class="tui-product-container" v-for="item,index in houseList" :key=index>
        <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.houseId+'&house='+encodeURIComponent(JSON.stringify(item))" open-type="navigate"
          hover-class="none">
          <house :house="item"></house>
        </navigator>
      </view>
    </view>
    <!--加载loading-->
    <tui-loadmore v-if="loading" :index="3" type="green"></tui-loadmore>
    <tui-nomore v-if="noMore" backgroundColor="#f7f7f7"></tui-nomore>
    <!--加载loading-->

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
    get,
    post
  } from "../../utils/requst";
  export default {
    data() {
      return {
        showloading: false,
        loadingText: "加载中...",
        tipsColor: "warning",
        tipsPosition: "top",
        keyword: "",
        //搜索关键词
        width: 200,
        //header宽度
        height: 64,
        //header高度
        tabIndex: 0,
        //顶部筛选索引
        isList: true,
        //是否以列表展示  | 列表或大图
        drawer: false,
        //筛选侧栏开关
        drawerH: 0,
        //抽屉内部scrollview高度
        selectedName: "排序",
        selectH: 0,
        houseList: [],
        page: 0,
        pageSize: 40,
        value: "",

        inputTop: "",
        ShowNodata: "",
        isActive: "",
        showRentSection: true,
        selected: "",
        showLoading: false,
        loading: false,
        loadingText: "",
        noMore: false,
        pageIndex: 0,
      };
    },

    onLoad: async function(options) {
      let obj = {};
      // #ifdef MP-WEIXIN
      obj = wx.getMenuButtonBoundingClientRect();
      // #endif
      // #ifdef MP-BAIDU
      obj = swan.getMenuButtonBoundingClientRect();
      // #endif
      // #ifdef MP-ALIPAY
      my.hideAddToDesktopMenu();
      // #endif
      uni.getSystemInfo({
        success: (res) => {
          this.width = obj.left || res.windowWidth;
          this.height = obj.top ?
            obj.top + obj.height + 8 :
            res.statusBarHeight + 44;
          this.inputTop = obj.top ?
            obj.top + (obj.height - 30) / 2 :
            res.statusBarHeight + 7;
          this.arrowTop = obj.top ?
            obj.top + (obj.height - 32) / 2 :
            res.statusBarHeight + 6;
          this.keyword = options.keyword || "";
          //略小，避免误差带来的影响
          this.dropScreenH = (this.height * 750) / res.windowWidth + 186;
          this.drawerH = res.windowHeight - uni.upx2px(100) - this.height;
        },
      });
      this.getSearchLists()
    },

    onShow() {},

    //下拉刷新
    async onPullDownRefresh() {},

    onReachBottom: function() {},
    methods: {


      //搜索框输入
      inputKeyWord(e) {
        this.page = 0;
        this.keyword = e.detail.value;
      },
      //搜索框开始搜索
      search() {
        this.page = 0;
        this.houseList = [];
      },
      //搜索
      async getSearchLists(page) {
        this.loading = true;
        let houseList = await this.http
          .post("/house/collect/list", {
            data: {
              page: this.page,
              pageSize: this.pageSize,
              keyword: this.keyword,
            },
          })
          .then((res) => {
            return res.data.item;
          });
        this.houseList = houseList
        console.log(houseList)
        this.loading = false
        this.noMore = true
        this.houseList = this.houseList.concat(houseList);
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

<style>

</style>
