<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <view slot="content">管理员</view>
    </cu-custom>
    <scroll-view scroll-y class="scrollPage">
      <view class="bg-gradual-primary page-title padding" style="width: 100%; height: 320rpx">
        <view class="page-title-main text-xxl">管理员权限</view>
        <view class="page-title-mini text-sm padding-tb-sm text-op-white text-Abc">
          您是管理员身份，可使用以下权限</view>
      </view>
      <view class="power bg-white margin-lr-sm padding-lr-sm padding-bottom-lg margin-bottom-lg"
        style="box-shadow: 0px 0px 12px 0px #80808066">
        <view class="cu-bar bg-white solid-bottom">
          <view class="action">
            <span class="iconfont icon-title text-blue"></span>
            <span class="text-blue margin-left">可用权限</span>
          </view>
        </view>

        <view class="grid col-3 margin-bottom text-center">
          <view v-for="(item, index) in elements" :key="index" class="power-item" v-if="item.show">
            <navigator :url="'/pages/' + item.url + '/' + item.url+'?'+item.params" class="power-item"
              :style="'background:' + item.color" @click="!item.url?showTips('敬请期待~', 'gray'):''">
              <view class="icon">
                <span :class="'iconfont ' + item.icon + ' text-white'"></span>
                <span :class="'iconfont ' + item.icon + ' text-white'"></span>
              </view>
              <view class="text">
                <view class="nav-title">{{ item.title }}</view>
                <view class="nav-name"></view>
              </view>
            </navigator>
          </view>

          <view class="power-item" v-if="true">
            <navigator class="power-item" style="background: #aadbe8" url="null">
              <view class="icon">
                <span class="iconfont icon-duomeitiicon- text-white"></span>
                <span class="iconfont icon-duomeitiicon- text-white"></span>
              </view>
              <view class="text">
                <view class="nav-title">暂无更多</view>
                <view class="nav-name"></view>
              </view>
            </navigator>
          </view>
        </view>
      </view>
      <view class="power bg-white margin-lr-sm padding-lr-sm padding-bottom-lg margin-bottom-lg"
        style="box-shadow: 0px 0px 12px 0px #80808066">
        <view class="cu-bar bg-white solid-bottom">
          <view class="action">
            <span class="iconfont icon-zonglan text-blue"></span>
            <span class="text-blue margin-left">租房总览</span>
          </view>
        </view>

        <view class="grid col-3 margin-bottom text-center">
          <view class="flex text-center bg-white text-blue">
            <view class="flex flex-sub flex-direction">
              <view class="text-xxl text-blue">{{
                overview.totalHouse ? overview.totalHouse : 0
              }}</view>
              <view class="margin-top-sm">
                <span class="iconfont icon-kejian"></span>
                现有房源
              </view>
            </view>
          </view>
          <view class="flex text-center bg-white text-blue">
            <view class="flex flex-sub flex-direction">
              <view class="text-xxl text-blue">{{
                overview.totalRented ? overview.totalRented : 0
              }}</view>
              <view class="margin-top-sm">
                <span class="iconfont icon-zuyong"></span>
                已租用
              </view>
            </view>
          </view>

          <view class="flex text-center bg-white text-blue">
            <view class="flex flex-sub flex-direction">
              <view class="text-xxl text-blue">{{
                overview.totalSigned ? overview.totalSigned : 0
              }}</view>
              <view class="margin-top-sm">
                <span class="iconfont icon-qianyuequerenqianyuedianziqianyue"></span>
                已签约
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="top: -150rpx; position: relative">
        <view class="cu-bar bg-white margin-top-xl">
          <view class="action sub-title">
            <text class="text-xl text-bold text-blue text-shadow">管理员指南</text>
            <text class="text-ABC text-blue">ADMINGUIDE</text>
          </view>
          <view class="action">
            <!-- <text class="text-lg text-grey text-shadow">更多</text> -->
          </view>
        </view>
        <view class="skill-sequence-panel-content-wrapper">
          <!--左边虚化-->
          <view class="hide-content-box hide-content-box-left"></view>
          <!--右边虚化-->
          <view class="hide-content-box hide-content-box-right"></view>
          <scroll-view scroll-x="true" class="kite-classify-scroll">
            <view class="kite-classify-cell shadow" v-for="(item, index) in curriculum" :key="index">
              <view :class="'nav-li bg-index' + (index + 1)">
                <view class="nav-name">{{ item.name }}</view>
              </view>
              <view class="nav-content text-df">{{ item.content }}</view>
              <view @click="" class="nav-btn shadow" :class="'bg-index' + (index + 1)">立即查看</view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="cu-tabbar-height"></view>
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
    </scroll-view>

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
        elements: [{
            title: "入职申请",
            color: "#e89ad7",
            icon: "icon-shenqing",
            url: "applyJob",
            power: "can_open_auth",
            params: "",
            show: true,
          },
          {
            title: "授权管理",
            color: "#85cb7a",
            icon: "icon--_shouquanguanli",
            url: "allStaff",
            power: "can_open_auth",
            params: "href=authManage",
            show: true,
          },
          {
            title: "员工资料",
            color: "#bfa7f5",
            icon: "icon-renyuan",
            url: "allStaff",
            power: "can_open_allUser",
            params: "href=updateStaff",
            show: true,
          },
          {
            title: "流水审核",
            color: "#99ccff",
            icon: "icon-qianyuequerenqianyuedianziqianyue",
            url: "checkBill",
            power: "can_open_checkBill",
            params: "",
            show: true,
          },
          {
            title: "奖扣薪资",
            color: "#dbd766",
            icon: "icon-icon-test1",
            url: "staffRank",
            power: "can_open_staffRank",
            params: "",
            show: true,
          },
          {
            title: "发布公告",
            color: "#e89ad7",
            icon: "icon-gonggao",
            url: "none",
            power: "none",
            params: "",
            show: true,
          },
          {
            title: "工资发放",
            color: "#bfa7f5",
            icon: "icon-gongzi",
            url: null,
            power: "none",
            params: "",
            show: true,
          },
          {
            title: "配房设置",
            color: "#aadbe8",
            icon: "icon-ic_manage_assignprop",
            url: null,
            power: "none",
            params: "",
            show: true,
          },
          {
            title: "租客轮播图",
            color: "#99ccff",
            icon: "icon-slide",
            url: null,
            power: "none",
            params: "",
            show: true,
          },
        ],
        overview: {
          allHouse: 0,
          allSigned: 0,
          allStaff: 0,
          allUser: 0,
          allrented: 0,
        },
        power: "",
        position: "",
        curriculum: [{
            name: "员工管理",
            content: "员工管理对当前门店站的所有职员进行管理...",
          },
          {
            name: "薪资管理",
            content: "薪资管理，对职员的薪资进行加薪降薪操作...",
          },
          {
            name: "流水管理",
            content: "拥有全套的流水管理，签约审核，勘察审核...",
          },
          {
            name: "用户管理",
            content: "对租客用户进行管理，进行个性化推广营销...",
          },
          {
            name: "论坛管理",
            content: "配套的租房论坛，把租客留住形成圈子...",
          },
        ],
      };
    },

    onLoad(options) {
      // 页面数据初始化
      this.init(); // 租房总览

      this.getUserGeneralInfo();
    },

    onShow() {
      this.getUserGeneralInfo();
    },

    methods: {
      init() {},

      async getUserGeneralInfo() {
        await this.http.get("/overview", {}).then((res) => {
          console.log(res.data);
          if (res.code == 200) {
            this.overview = {
              ...res.data,
            };
          } else if (res.code == 403) {
            this.showTips(res.msg, "warning");
            return;
          }
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
<style scoped>
  .text-op-white {
    color: rgba(255, 255, 255, 0.8);
  }

  .scrollPage .page-title .page-title-main {
    font-weight: 600;
    letter-spacing: 4rpx;
  }

  .scrollPage .page-title .page-title-mini {
    font-weight: 200;
  }

  .scrollPage .power {
    position: relative;
    top: -150rpx;
    overflow: hidden;
    border-radius: 20rpx;
  }

  .scrollPage .power .power-item {
    padding: 8rpx 10rpx;
    color: var(--white);
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
  }

  .scrollPage .power .power-item .icon {
    display: flex;
    justify-content: flex-start;
    padding-top: 10rpx;
  }

  .scrollPage .power .power-item .icon .iconfont {
    float: left;
    font-size: 56rpx;
    font-weight: 400;
  }

  .scrollPage .power .power-item .icon .iconfont:nth-child(2) {
    opacity: 0.1;
    position: relative;
    top: 1em;
    right: -1em;
    font-size: 60rpx;
    font-weight: 400;
  }

  .scrollPage .power .power-item .text {
    display: flex;
    padding: 5rpx 0;
    justify-content: flex-start;
    align-items: flex-end;
    padding-bottom: 10rpx;
  }

  .scrollPage .power .power-item .text .nav-title {
    font-size: 32rpx;
    font-weight: 200;
  }

  .scrollPage .power .power-item .text .nav-name {
    text-indent: 2rpx;
    text-transform: capitalize;
    white-space: normal;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .scrollPage .power .power-item .text .nav-name:first-letter {
    font-weight: 400;
  }

  .skill-sequence-panel-content-wrapper {
    position: relative;
    white-space: nowrap;
    padding: 10rpx 0 10rpx 10rpx;
  }

  /*左右渐变遮罩*/
  .hide-content-box {
    position: absolute;
    top: 0;
    height: 100%;
    width: 10px;
    z-index: 2;
  }

  .hide-content-box-left {
    left: 0;
    background-image: linear-gradient(to left,
        rgba(255, 255, 255, 0),
        #f3f3f3 60%);
  }

  .hide-content-box-right {
    right: 0;
    background-image: linear-gradient(to right,
        rgba(255, 255, 255, 0),
        #f3f3f3 60%);
  }

  .kite-classify-scroll {
    width: 100%;
    height: 380rpx;
    overflow: hidden;
    white-space: nowrap;
  }

  .kite-classify-cell {
    display: inline-block;
    width: 266rpx;
    height: 370rpx;
    margin-right: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    overflow: hidden;
    box-shadow: 2px 2px 3px rgba(26, 26, 26, 0.2);
  }

  .nav-li {
    padding: 40rpx 30rpx;
    width: 100%;
    background-image: url(https://s1.ax1x.com/2020/06/27/NyU04x.png);
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
  }

  .nav-name {
    font-size: 28upx;
    text-transform: Capitalize;
    margin-top: 20upx;
    position: relative;
  }

  .nav-name::before {
    content: "";
    position: absolute;
    display: block;
    width: 40rpx;
    height: 6rpx;
    background: #fff;
    bottom: 0;
    right: 0;
    opacity: 0.5;
  }

  .nav-name::after {
    content: "";
    position: absolute;
    display: block;
    width: 100rpx;
    height: 1px;
    background: #fff;
    bottom: 0;
    right: 40rpx;
    opacity: 0.3;
  }

  .nav-content {
    width: 100%;
    padding: 15rpx;
    display: inline-block;
    overflow-wrap: break-word;
    white-space: normal;
  }

  .nav-btn {
    width: 200rpx;
    height: 60rpx;
    margin: 8rpx auto;
    text-align: center;
    line-height: 60rpx;
    border-radius: 10rpx;
  }

  .bg-index1 {
    background-color: #19cf8a;
    color: #fff;
  }

  .bg-index2 {
    background-color: #954ff6;
    color: #fff;
  }

  .bg-index3 {
    background-color: #5177ee;
    color: #fff;
  }

  .bg-index4 {
    background-color: #f49a02;
    color: #fff;
  }

  .bg-index5 {
    background-color: #ff4f94;
    color: #fff;
  }

  .bg-index6 {
    background-color: #7fd02b;
    color: #fff;
  }

  .item-name {
    margin-bottom: 15rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
</style>
