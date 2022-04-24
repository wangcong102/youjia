<template>
  <view class="bg-gradual-blue">
    <!-- <cu-custom bgColor="bg-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">精选房源</block>
    </cu-custom> -->
    <scroll-view scroll-y class="DrawerPage" :class="showSiderbar? 'show' : ''">
      <swiper :class="'screen-swiper round-dot'" indicator-dots="true" circular="true" autoplay="true" interval="20000"
        duration="600">
        <swiper-item v-for="(item, index) in house.videoUrl" :key="index" @tap="previewVideo" :data-index="index">
          <video :src="item.url" autoplay loop muted show-play-btn="false" controls="false" objectFit="cover"></video>
        </swiper-item>
        <swiper-item v-for="(item, index) in house.imgUrl" :key="index" @tap="previewImage" :data-index="index">
          <image :src="item" mode="aspectFill" v-if="item.type != 'image'"></image>
        </swiper-item>
        <swiper-item v-if="house.imgUrl.length == 0">
          <image src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png"
            mode="aspectFill"></image>
        </swiper-item>
      </swiper>

      <view class="cu-bar bg-white solid-bottom">
        <view class="text-xl text-black padding-lr" :data-copyText="house.title" :data-time="lastTapTime">
          {{ house.title }}
        </view>
      </view>

      <view class="padding flex text-center text-grey bg-white solid-bottom">
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-lg text-red">{{ house.rent }}元/月</view>
          <view class="margin-top-sm text-sm">
            <span class="iconfont icon-fangwuzujin text-grey"></span>
            租金
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-lg text-red">
            {{ house.houseType.rooms }}室{{ house.houseType.halls }}厅{{house.houseType.toilets}}卫
          </view>
          <view class="margin-top-sm text-sm">
            <span class="iconfont icon-huxing text-grey"></span>
            户型
          </view>
        </view>
        <view class="flex flex-sub flex-direction solid-right">
          <view class="text-lg text-red">{{ house.area }}m²</view>
          <view class="margin-top-sm text-sm">
            <span class="iconfont icon-mianji-xian text-grey"></span>
            面积
          </view>
        </view>
      </view>

      <view class="bg-white padding-lr">
        <view class="flex">
          <view class="flex flex-sub margin-xs radius">
            <view class="text-grey">
              <span class="iconfont icon-louceng2 text-grey"></span>
              楼层：
            </view>
            <view class> {{ house.floor.atFloor }}/{{ house.floor.totalFloor }}层 </view>
          </view>
          <view class="flex flex-sub margin-xs radius">
            <view class="text-grey">
              <span class="iconfont icon-number text-grey"></span>
              房号：
            </view>
            <view class> {{ house.houseNum }}室 </view>
          </view>
        </view>
        <view class="flex">
          <view class="flex flex-sub margin-xs radius">
            <view class="text-grey">
              <span class="iconfont icon-jiancefangfa text-grey"></span>
              用途：
            </view>
            <view class>
              {{ house.useWay }}
            </view>
          </view>
          <view class="flex flex-sub margin-xs radius">
            <view class="text-grey">
              <span class="iconfont icon-zhifufangshi1 text-grey"></span>
              支付：
            </view>
            <view class>
              押{{ utils.numTran(house.payMethod.mortgage) }}付{{utils.numTran(house.payMethod.pay)}}
            </view>
          </view>
        </view>
      </view>

      <view class="padding-sm flex flex-wrap bg-white padding-lr">
        <view class="padding-xs">
          <view v-for="(item, index) in house.tags" :key="index" class="cu-tag bg-grey light margin-xs">
            {{ item }}
          </view>
        </view>
      </view>

      <view class="cu-bar bg-white margin-top-sm solid-bottom">
        <view class="action">
          <span class="iconfont icon-round text-blue margin-right-sm"></span>
          位置周边
        </view>
      </view>

      <view class="bg-white padding flex flex-direction">
        <view class="flex-sub position-item padding-bottom-xs">
          <view class="fl text-grey" style="width: 100rpx"> 地址： </view>
          <view class="fl" style="width: calc(100% - 100rpx)">
            <view
              :data-copyText="house.region.province +'-' +house.region.city +'-' +house.region.area +'-' +house.address"
              :data-time="lastTapTime">
              {{ house.region.province }}-{{ house.region.city }}-{{ house.region.area }}
            </view>
          </view>
        </view>
        <view class="flex-sub position-item padding-bottom-xs">
          <view class="fl text-grey" style="width: 100rpx"> 详细： </view>
          <view class="fl" style="width: calc(100% - 100rpx)">
            <view
              :data-copyText="house.region.province +'-' +house.region.city +'-' +house.region.area +'-' +house.address"
              :data-time="lastTapTime">
              {{ house.address }}
            </view>
          </view>
        </view>
        <view class="flex-sub position-item padding-tb-xs">
          <view class="fl text-grey" style="width: 100rpx"> 地段： </view>
          <view class="fl" style="width: calc(100% - 100rpx)">
            <view>
              <view v-for="(item, index) in house.districts" :key="index" class="fl" :data-copyText="item"
                :data-time="lastTapTime">
                {{ item }}
                <text v-if="index != house.districts.length - 1">、</text>
              </view>
            </view>
          </view>
        </view>
        <view class="flex-sub position-item padding-tb-xs">
          <view class="fl text-grey" style="width: 100rpx"> 地铁： </view>
          <view class="fl" style="width: calc(100% - 100rpx)">
            <view v-for="(item, index) in house.subways" :key="index" class="padding-tb-xs" :data-copyText="item"
              :data-time="lastTapTime">
              {{ item }}
            </view>
          </view>
        </view>
      </view>

      <view class="cu-bar bg-white margin-top-sm solid-bottom">
        <view class="action">
          <span class="iconfont icon-iconfkzt text-blue margin-right-sm"></span>
          状态
        </view>
      </view>
      <view class="bg-white padding flex flex-direction">
        <view class="flex-sub position-item padding-bottom-xs">
          <view class="fl text-grey" style="width: 150rpx"> 状态： </view>
          <view class="fl" style="width: calc(100% - 150rpx)">
            <view>
              {{ house.isRented ? "已租" : "未租" }}
            </view>
          </view>
        </view>
      </view>
      <view class="padding flex flex-direction margin-bottom-xl"></view>
      <view class="padding flex flex-direction margin-bottom-xl"></view>

    </scroll-view>
    <view class="DrawerClose" :class="showSiderbar ? 'show' : ''" @tap="toggleSidebar">
      <text class="cuIcon-pullright"></text>
    </view>
    <scroll-view scroll-y class="DrawerWindow bg-gray" @scrolltolower="getNextData" :class="showSiderbar ? 'show' : ''">
      <view class="houseListTitle bg-gray">
        <image class="houseListTitleImg" src="../../static/image/logo-blue-small.png" mode="heightFix"></image>
      </view>
      <view style="border-radius: 15px; overflow: hidden">
        <view class="houseListBar cu-bar bg-white">
          <view class="action sub-title">
            <text class="text-xl text-bold text-blue text-shadow">精选房屋</text>
            <text class="text-ABC text-blue">CarefulHouse</text>
          </view>
          <view class="action">
            <text class="text-lg text-grey text-shadow">{{totalHouse}}个</text>
          </view>
        </view>
        <view class="houseListContent">
          <block v-for="(item, index) in houseList" :key="index">
            <!--商品列表-->
            <view class='tui-pro-item tui-flex-list' hover-class="hover" hover-start-time="150" @click="choiceHouse"
              :data-index="index">
              <img :src="
                    item.imgUrl[0]
                      ? item.imgUrl[0]
                      : 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png'
                  " class="tui-pro-img-list bg-gray" mode="heightFix" />
              <view class="tui-pro-content">
                <view class="text-darkGray tui-pro-tit">
                  <text v-if="item.atTop" class="cuIcon-appreciatefill text-themeColor"></text>
                  {{ item.title }}
                </view>
                <view>
                  <view class="padding-top-xs">
                    <block v-if="item.houseType.rooms==1&amp;item.houseType.halls==0">
                      <view class="text-grey tui-pro-subtit">
                        <view>
                          <span>{{ item.houseNum }}室 • </span>
                          <span>单间 • </span>
                          <span>楼{{ item.floor.atFloor }}/{{ item.floor.totalFloor }}</span>
                        </view>
                      </view>
                    </block>
                    <block v-else="">
                      <view class="text-grey tui-pro-subtit">
                        <span>{{ item.houseNum }}室 • </span>
                        <span>{{ item.houseType.rooms }}房{{item.houseType.halls}}厅{{ item.houseType.toilets }}卫 •
                        </span>
                        <span>楼{{ item.floor.atFloor }}/{{ item.floor.totalFloor }}</span>
                      </view>
                    </block>
                  </view>

                  <view class="tui-pro-price">
                    <text class="tui-sale-price-list">{{item.rent}}</text>
                    <text class="tui-price-measure">元/月</text>
                  </view>
                </view>
                <view class="check-img" v-if="item.checked">
                  <image src="/static/pages/index/checked.png" />
                </view>
              </view>
            </view>
            <!--商品列表-->
          </block>
        </view>
      </view>
    </scroll-view>
    <view class="cu-bar tabbar border shop foot" style="background-color: #ffffffee">
      <view class="btn-group">
        <button class="cu-btn bg-blue lg round shadow-blur" @click="reserveHouse">
          <span class="iconfont icon-yuyue1 padding-right-xs text-xl"></span>预约看房
        </button>
        <button class="cu-btn lg round shadow-blur" open-type="share" :class="[house.isLike ? 'bg-red' : 'bg-orange']"
          @click="likeHouse" :data-houseId="house.houseId">
          <span class="iconfont icon-xihuan padding-right-xs"></span>
          喜欢
        </button>
      </view>
      <button class="action" @click="toggleSidebar">
        <view style="padding-bottom: 10upx">
          <span class="iconfont icon-liebiao text-blue text-shadow"></span>
        </view>
        <view class="text-shadow text-black"> 打开列表 </view>
      </button>

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
        allallot_id: "",
        houseList: [],
        house: {
          id: 0,
          isLike: false,
          houseId: "",
          title: "",
          imgUrl: [],
          videoUrl: [],
          address: "",
          region: {
            area: "",
            city: "",
            province: "",
          },
          area: 0,
          rent: 0,
          districts: [],
          direction: "",
          houseNum: "",
          houseType: {
            halls: 0,
            rooms: 0,
            toilets: 0,
          },
          floor: {
            atFloor: 0,
            totalFloor: 0,
          },
          subways: [""],
          payMethod: {
            pay: 0,
            mortgage: 0,
          },
          landlord: "",
          phone: "",
          tags: [],
          useWay: "",
          dueTime: "None",
          isRented: false,
          isTop: false,
          at_create: "",
          at_update: "",
          staff_id: 0,
        },
        payArr: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
        loading: true,
        pullUpOn: true,
        showSiderbar: true,
        lastTapTime: "",
        shareParams: {
          title: "【精选房源】分享了快来看一看吧！",
          path: "/page/allotHouse/allotHouse",
          imageUrl: "https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/allot_house_share_post.png",
        },
        page: 0,
        pageSize: 50,
        keyword: "",
        s_filter: {
          landlord: ""
        },
        totalHouse: 0,
        isFinshed: false,
        guideInfo: []
      };
    },
    async onLoad(options) {
      this.allot_id = options.allot_id || "36K6qE9RubxCdICg";
      this.getAllotLists();
      this.getGuideInfo();
    },
    onReady() {
      // #ifdef MP
      wx.updateAppMessageShareData({
        title: "优家房源", // 分享标题
        desc: "【精选房源】分享了快来看一看吧！", // 分享描述
        link: "https://home.l0o0l.cn/allotHouse?allot_id=" + this.allot_id,
        imgUrl: "https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/allot_house_share_post.png", // 分享图标
        success: function() {
          // 设置成功
        }
      });
      wx.onMenuShareTimeline({
        title: "优家房源", // 分享标题
        link: "https://home.l0o0l.cn/allotHouse?allot_id=" + this.allot_id,
        imgUrl: "https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/allot_house_share_post.png", // 分享图标
      });
      // #endif
    },
    //下拉刷新
    async onPullDownRefresh() {
      this.loadingCpt(true);
      await this.getAllotLists();
      this.loadingCpt(false);
      uni.stopPullDownRefresh();
    },
    methods: {
      async getAllotLists() {
        this.loadingCpt(true);
        await this.http
          .get("/house/allot/list", {
            data: {
              allot_id: this.allot_id,
              page: this.page,
              pageSize: this.pageSize
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              let houseList = res.data.item
              if (houseList.length > 0 && this.houseList.length == 0) {
                this.house = houseList[0];
              }
              this.totalHouse = res.data.total
              this.houseList = this.houseList.concat(houseList);
              this.isFinshed = houseList.length == 0 ? true : false

            } else if (res.code == 204) {
              uni.showModal({
                title: "配房",
                content: res.msg,
                showCancel: false,
                success: ({
                  confirm,
                  cancel
                }) => {
                  if (confirm) {
                    uni.navigateBack({
                      delta: 1
                    });
                  }
                },
              });
            } else {
              this.showTips(res.msg, "warning", "bottom");
            }
          })
          .catch((e) => {
            console.log(e);
          });
        /* #ifdef MP */
        this.showShareMenu();
        /* #endif */
        this.loadingCpt(false);
      },
      toggleSidebar(e) {
        this.showSiderbar = !this.showSiderbar;
      },
      // 点击喜欢
      likeHouse(e) {
        let {
          houseId
        } = e.currentTarget.dataset;
        let isLike = this.house.isLike;
        this.house.isLike = !isLike;
        console.log(this.house.isLike);
        this.showTips("感谢点心~", "success", "bottom");
      },
      choiceHouse(e) {
        let {
          index
        } = e.currentTarget.dataset;
        console.log(e);
        console.log(index);
        this.house = this.houseList[index];
        this.toggleSidebar();
      },
      // 打开分享按钮
      showShareMenu() {
        wx.showShareMenu({
          withShareTicket: true,
          menus: ["shareAppMessage", "shareTimeline"],
        });
      },
      // 预约看房
      reserveHouse() {
        let contactList = []
        this.guideInfo.forEach(item => {
          contactList.push(item.name + "  " + item.phone)
        })
        console.log(contactList)
        uni.showActionSheet({
          itemList: contactList,
          success: (res) => {
            let index = res.tapIndex
            uni.makePhoneCall({
              phoneNumber: this.guideInfo[index].phone
            });
          },
          fail: function(res) {
            console.log(res.errMsg);
          }
        });
        // this.showTips("暂时自行联系带看小哥~", "gray", "bottom");
      },
      //预览图片
      previewImage(e) {
        console.log(e.currentTarget.dataset.index);
        let index = e.currentTarget.dataset.index;
        uni.previewImage({
          current: this.house.imgUrl[index],
          urls: this.house.imgUrl,
        });
      },
      // houseList触底加载
      getNextData(e) {
        if (!this.isFinshed) {
          this.page = this.page + 1;
          this.getAllotLists()
        }
      },
      // 获取带看小哥信息
      getGuideInfo() {
        this.http.get("/user/guide/info", ).then(res => {
          console.log(res)
          this.guideInfo = res.data.item
        })
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
    onShareAppMessage() {
      let shareParams = this.shareParams;
      uni.setClipboardData({
        data: "https://home.l0o0l.cn/allotHouse" + "?allot_id=" + this.allot_id,
      });
      // http://localhost:8080/#/pages/allotHouse/allotHouse?allot_id=rMDzx3lFQFp1Hg8
      uni.navigateToMiniProgram({
        appId: "wx22d72b15eec19543",
        path: "https://home.l0o0l.cn/allotHouse" + "?allot_id=" + this.allot_id,
        // path: "pages/allotHouse/allotHouse" + "?allot_id=" + this.allot_id,
        envVersion: "develop",
        extraData: {
          data1: "test",
        },
      });
      return {
        title: shareParams.title,
        path: shareParams.path + "?allot_id=" + this.allot_id,
        imageUrl: shareParams.imageUrl,
      };
    },
  };
</script>
<style scoped>
  swiper {
    width: 100%;
    height: 500rpx;
  }

  .DrawerPage {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0vw;
    background-color: #f1f1f1;
    transition: all 0.4s;
  }

  .DrawerPage.show {
    transform: scale(0.9, 0.9);
    left: 85vw;
    box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
    transform-origin: 0;
  }

  .DrawerWindow {
    position: absolute;
    width: 85vw;
    height: 100vh;
    left: 0;
    top: 0;
    transform: scale(0.9, 0.9) translateX(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s;
    padding: 100upx 0;
  }

  .DrawerWindow.show {
    transform: scale(1, 1) translateX(0%);
    opacity: 1;
    pointer-events: all;
  }

  .DrawerClose {
    position: absolute;
    width: 40vw;
    height: 100vh;
    right: 0;
    top: 0;
    color: transparent;
    padding-bottom: 30upx;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-image: linear-gradient(90deg,
        rgba(0, 0, 0, 0.01),
        rgba(0, 0, 0, 0.6));
    letter-spacing: 5px;
    font-size: 50upx;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s;
  }

  .DrawerClose.show {
    opacity: 1;
    pointer-events: all;
    width: 15vw;
    color: #fff;
  }

  .DrawerPage .cu-bar.tabbar .action button.cuIcon {
    width: 64upx;
    height: 64upx;
    line-height: 64upx;
    margin: 0;
    display: inline-block;
  }

  .DrawerPage .cu-bar.tabbar .action .cu-avatar {
    margin: 0;
  }

  .DrawerPage .nav {
    flex: 1;
  }

  .DrawerPage .nav .cu-item.cur {
    border-bottom: 0;
    position: relative;
  }

  .DrawerPage .nav .cu-item.cur::after {
    content: "";
    width: 10upx;
    height: 10upx;
    background-color: currentColor;
    position: absolute;
    bottom: 10upx;
    border-radius: 10upx;
    left: 0;
    right: 0;
    margin: auto;
  }

  .DrawerPage .cu-bar.tabbar .action {
    flex: initial;
  }


  .tui-pro-item {
    width: calc(100% - 10rpx);
    background: #fff;
    box-sizing: border-box;
    border-radius: 15rpx;
    transition: all 0.1s ease-in-out;
    background-color: #fff;
    position: relative;
    box-shadow: 2rpx 2rpx 10rpx 4rpx #d3d3d3ce;
    overflow: hidden;
  }

  .tui-flex-list {
    display: flex;
    width: calc(100% - 32rpx);
    margin: 10rpx 16rpx 10rpx 16rpx;
    margin-bottom: 10rpx !important;
  }

  .tui-pro-img-list {
    position: relative;
    display: block;
    height: 150rpx !important;
    min-width: 200rpx;
    border-radius: 15rpx 0 0 15rpx;
  }

  .tui-proimg-list {
    flex-shrink: 0;
  }

  .tui-pro-content {
    display: flex;
    width: 100%;
    height: 150rpx;
    flex-direction: column;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 0 15rpx 0 15rpx;
  }

  .tui-pro-tit {
    font-size: 32rpx;
    text-shadow: 1rpx 1rpx 5rpx rgba(0, 0, 0, 0.1);
    font-weight: 400;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .tui-pro-subtit {
    font-size: 24rpx;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .tui-pro-price {
    padding-top: 15rpx;
  }

  .tui-price-measure {
    font-size: 26rpx;
    font-weight: 400;
    color: var(--themeColor);
    text-shadow: 1rpx 1rpx 5rpx rgb(0, 129, 255, 0.2);
  }

  .tui-sale-price-list {
    font-size: 36rpx;
    font-weight: 600;
    letter-spacing: 1rpx;
    color: var(--themeColor);
  }

  .sub-title {
    font-size: 24rpx;
    color: #7a7a7a;
    padding-top: 18rpx;
  }


  .check-img {
    width: 60rpx;
    height: 60rpx;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
  }

  .check-img image {
    width: 100%;
    height: 100%;
  }

  .houseListBar {
    position: fixed;
    top: 100upx;
    margin: 0 10rpx;
    width: calc(100% - 20rpx);
    z-index: 9;
    border-radius: 10rpx;
  }

  .houseListContent {
    margin-top: 110upx;
    overflow: hidden;
  }

  .foot {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 99;
    box-shadow: 0 -1upx 6upx rgba(0, 0, 0, 0.1);
  }

  .houseListTitle {
    position: fixed;
    width: calc(100% - 20upx);
    height: 80upx;
    top: 0upx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10upx;
  }

  .houseListTitleImg {
    width: 100%;
    height: 80upx;
    overflow: hidden;
  }
</style>
