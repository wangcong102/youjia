<template>
  <view class="container">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">楼栋分区</view>
    </cu-custom>
    <!--list-->
    <view>
      <view class="flex bg-white border justify-center padding solid">
        <view class="flex flex-sub justify-center text-shadow" @click="filterRented" data-value="0">全部</view>
        <view class="flex flex-sub justify-center text-shadow" @click="filterRented" data-value="1">已租</view>
        <view class="flex flex-sub justify-center text-shadow" @click="filterRented" data-value="2">未租</view>
      </view>
      <block v-if="!ShowNodata">

        <view class="tui-product-list">
          <view class="tui-product-container">
            <block v-for="(item, index) in houseList" :key="index">
              <!--商品列表-->
              <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.houseId+'&house='+encodeURIComponent(JSON.stringify(item))" open-type="navigate"
                hover-class="none">
                <view class="tui-pro-item tui-flex-list">
                  <img :src="
                      item.imgUrl[0]
                        ? item.imgUrl[0]
                        : 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png'
                    " class="bg-gray tui-proimg-list tui-pro-img-list" mode="aspectFill" />
                  <view class="tui-pro-content">
                    <view class="text-darkGray tui-pro-tit">
                      <text v-if="item.atTop" class="cuIcon-appreciatefill text-themeColor"></text>
                      {{ item.title }}
                    </view>
                    <view>
                      <view class="padding-top-xs">
                        <block v-if="item.houseType.rooms==1&amp;item.houseType.halls==0">
                          <text class="text-grey tui-pro-subtit">
                            <text class="text-grey text-bold">{{ item.houseNum }}室</text> • 单间 • {{ item.area }}m²•楼{{
                            item.floor.atFloor
                          }}/{{ item.floor.totalFloor }}
                          </text>
                        </block>
                        <block v-else="">
                          <text class="text-grey tui-pro-subtit">
                            <text class="text-grey text-bold">{{ item.houseNum }}室</text> •
                            {{ item.houseType.rooms }}房{{
                            item.houseType.halls
                          }}厅{{ item.houseType.toilets }}卫•{{ item.area }}m²•楼{{
                            item.floor.atFloor
                          }}/{{ item.floor.totalFloor }}
                          </text>
                        </block>
                      </view>
                      <view class="tui-pro-price flex justify-between">
                        <view>
                          <text class="tui-sale-price-list">{{ item.rent }}</text>
                          <text class="tui-price-measure">元/月</text>
                        </view>
                        <!-- <view style="text-shadow: 1px 1px 2px #0081ff66">
                          <text style="text-shadow: 1px 1px 2px #0081ff66" class="text-green">{{ item.houseNum }}室</text>
                        </view> -->
                      </view>
                    </view>
                  </view>
                </view>
              </navigator>
              <!--商品列表-->
            </block>
          </view>
        </view>
      </block>

      <block v-else="">
        <view class="nodata" :style="'margin-top:' + (18) + 'rpx'">
          <img class="nodataImg" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
        </view>
      </block>
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
        address: "",
        page: 0,
        pageSize: 20,
        houseList: [],
        isList: true,
        ShowNodata: false,
        keyword: "",
        isRented: [true, false],
      };
    },
    async onLoad(options) {
      this.address = options.address;
      if (this.address) {
        this.loadingCpt(true);
        await this.getSearchLists();
        this.loadingCpt(false);
      } else {
        uni.showToast({
          title: "暂无分区房源",
          icon: "none",
        });
        this.ShowNodata = true;
      }
    },
    methods: {
      //搜索
      async getSearchLists() {
        let s_filter = {
          address: this.address,
          isRented: this.isRented,
        };
        let houseList = await this.http
          .post("/house/search", {
            data: {
              page: this.page,
              pageSize: this.pageSize,
              keyword: this.keyword,
              s_filter: s_filter,
              sortby: ["houseNum"],
              order: "asc",
            },
          })
          .then((res) => {
            console.log(res);
            // 修复h5选中图标异常显示
            res.data.item.forEach((item) => {
              item.checked = false;
            });
            return res.data.item;
          });
        this.houseList = this.houseList.concat(houseList);
        this.ShowNodata = houseList == "" && this.houseList == "" ? true : false;
      },
      inputKeyWord(e) {
        this.page = 0;
        this.keyword = e.value;
      },
      search() {
        this.goTop();
        this.page = 0;
        this.houseList = [];
        this.getSearchLists();
      },
      async filterRented(e) {
        console.log(e);
        console.log(e.currentTarget.dataset.value);
        let value = e.currentTarget.dataset.value;
        if (value == "0") {
          this.isRented = [true, false];
        } else if (value == "1") {
          this.isRented = [true];
        } else if (value == "2") {
          this.isRented = [false];
        }
        this.houseList = [];
        this.loadingCpt(true);
        await this.getSearchLists();
        this.loadingCpt(false);
      },
      goTop(e) {
        uni.pageScrollTo({
          scrollTop: 0,
        });
      },
      onReachBottom: function() {
        this.page += 1;
        this.getSearchLists();
      },
      // 通用组件调用v0.3
      showTips: function(
        msg = "成功",
        type,
        position = "center",
        duration = 1500
      ) {
        console.log(position);
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
      href(type) {
        if (type == 1) {
          this.tui.href("../notice/notice");
        } else {
          this.tui.toast("功能开发中~");
        }
      },
    },
  };
</script>


<style scoped>
  page {
    background: #ffffff;
  }

  .container {
    padding-bottom: env(safe-area-inset-bottom);
  }


  .tui-product-list {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
  }

  .tui-product-container {
    flex: 1;
    margin-right: 10rpx;
    flex-direction: column;
  }

  .tui-product-container:last-child {
    margin-right: 0;
  }

  .tui-pro-item {
    width: calc(100% - 10rpx);
    margin-bottom: 20rpx;
    background: #fff;
    box-sizing: border-box;
    border-radius: 15rpx;
    transition: all 0.1s ease-in-out;
    background-color: #fff;
    position: relative;
    margin: 0 5rpx 20rpx 5rpx;
    position: relative;
    box-shadow: 2rpx 2rpx 10rpx 4rpx #d3d3d3ce;
    overflow: hidden;
  }

  .tui-flex-list {
    display: flex;
    width: calc(100% - 32rpx);
    margin: 0 16rpx 20rpx 16rpx;
    margin-bottom: 10rpx !important;
  }

  .tui-pro-img-list {
    position: relative;
    width: 100%;
    display: block;
    height: 160rpx !important;
    border-radius: 15rpx 0 0 15rpx;
  }

  .tui-proimg-list {
    width: 260rpx;
    height: 260rpx;
    flex-shrink: 0;
  }

  .tui-pro-content {
    display: flex;
    width: 100%;
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

  .container {
    box-sizing: border-box;
  }

  .nodata {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    overflow: hidden;
    width: 100%;
  }

  .nodataImg {
    max-width: 600rpx;
    max-height: 600rpx;
  }
</style>
