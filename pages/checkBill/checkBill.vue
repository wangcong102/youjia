<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <view slot="content">流水审核</view>
    </cu-custom>
    <view class="container">
      <scroll-view scroll-x class="bg-white nav">
        <view class="flex text-center">
          <view :class="'cu-item flex-sub ' + (TabCur == 0 ? 'text-blue cur' : '')" @tap="tabSelect" :data-id="0">
            待处理
          </view>
          <view :class="'cu-item flex-sub ' + (TabCur == 1 ? 'text-blue cur' : '')" @tap="tabSelect" :data-id="1">
            已处理
          </view>
        </view>
      </scroll-view>

      <view :hidden="!(TabCur == 0)">
        <block v-if="pendingBills.list.length">
          <view v-for="(item, index) in pendingBills.list" :key="index" class="tui-order-item">
            <tui-list-cell :hover="false" :lineLeft="false">
              <view class="tui-goods-title">
                <view class="text-grey text-cut text-sm">流水单号：{{ item.bill_number }} </view>
                <view class="tui-order-status">待处理</view>
              </view>
            </tui-list-cell>
            <tui-list-cell padding="0">
              <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.house.houseId" hover-class="none">
                <view class="tui-goods-item">
                  <view class="tui-goods-img">
                    <image class="radius" :src="
                        item.house.imgUrl[0]
                          ? item.house.imgUrl[0]
                          : 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png'
                      " mode="widthFix"></image>
                  </view>
                  <view class="tui-goods-center">
                    <view class="tui-goods-name">{{ item.house.title }}</view>
                    <view class="tui-goods-attr">
                      <block v-if="
                          (item.house.houseType.rooms == 1) &
                          (item.house.houseType.halls == 0)
                        ">
                        <span class="text-grey">{{ item.house.houseNum }}室 • 单间 • {{ item.house.area }}m² •
                          楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</span>
                      </block>
                      <block v-else>
                        <span class="text-grey">{{ item.house.houseNum }}室 •
                          {{item.house.houseType.rooms}}房{{ item.house.houseType.halls }}厅{{item.house.houseType.toilets}}卫
                          • {{ item.house.area  }}m² •
                          楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</span>
                      </block>
                    </view>
                  </view>
                </view>
              </navigator>
            </tui-list-cell>
            <tui-list-cell :hover="false" :last="true">
              <view class="flex justify-between">
                <view class="tui-goods-price">
                  <view>经手人：{{ item.staff.realName }}</view>
                </view>
                <view class="tui-goods-price">
                  <view v-if="item.bill_type==1">付款人：{{ item.payer }}</view>
                </view>
                <view class="tui-goods-price">
                  <view class="text-xl text-blue"> ￥{{ item.real_rent }} </view>
                </view>
              </view>
            </tui-list-cell>
            <view class="tui-order-btn">
              <view class="">
                <view class="">
                  <text class="text-grey">类型：</text>
                  <text v-if="item.bill_type==1">签约</text>
                  <text v-if="item.bill_type==2">勘察</text>
                  <text v-if="item.bill_type==3">人工</text>
                </view>
              </view>
              <view class="">
                <button class="line-blue radius text-sm padding-lr-lg" @tap="handleBills" :data-index="index"
                  :data-operate="2" :data-bill_number="item.bill_number">
                  删除签约
                </button>
              </view>
              <view class="">
                <button class="bg-blue radius text-sm padding-lr-lg" @tap="handleBills" :data-operate="1"
                  :data-index="index" :data-bill_number="item.bill_number">
                  通过签约
                </button>
              </view>
            </view>
          </view>
        </block>

        <block v-else-if="inited">
          <view class="nodata">
            <img class="nodataImg" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
          </view>
        </block>
      </view>

      <view :hidden="!(TabCur == 1)">
        <block v-if="processedBills.list.length">
          <view v-for="(item, index) in processedBills.list" :key="index" class="tui-order-item">
            <tui-list-cell :hover="false" :lineLeft="false">
              <view class="tui-goods-title">
                <view class="text-grey text-cut text-sm">流水单号：{{ item.bill_number }}</view>
                <view class="tui-order-status">已处理</view>
              </view>
            </tui-list-cell>
            <tui-list-cell padding="0">
              <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.house.houseId" hover-class="none">
                <view class="tui-goods-item">
                  <view class="tui-goods-img">
                    <image class="radius" :src="
                        item.house.imgUrl[0]
                          ? item.house.imgUrl[0]
                          : 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png'
                      " mode="widthFix"></image>
                  </view>
                  <view class="tui-goods-center">
                    <view class="tui-goods-name">{{ item.house.title }}</view>
                    <view class="tui-goods-attr">
                      <block v-if="
                          (item.house.houseType.rooms == 1) &
                          (item.house.houseType.halls == 0)
                        ">
                        <view class="text-grey">{{ item.house.houseNum }}室 • 单间 • {{ item.house.area }}m² •
                          楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</view>
                      </block>
                      <block v-else>
                        <view class="text-grey">{{ item.house.houseNum }}室 •
                          {{ item.house.houseType.rooms }}房{{item.house.houseType.halls}}厅{{ item.house.houseType.toilets }}卫
                          • {{ item.house.area }}m² • 楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}
                        </view>
                      </block>
                    </view>
                  </view>
                </view>
              </navigator>
            </tui-list-cell>
            <tui-list-cell :hover="false" :last="true">
              <view class="flex justify-between">
                <view class="tui-goods-price">
                  <view>经手人：{{ item.staff.realName }}</view>
                </view>
                <view class="tui-goods-price">
                  <view v-if="item.bill_type==1">付款人：{{ item.payer }}</view>
                </view>
                <view class="tui-goods-price">
                  <view :class="
                    'text-xl ' +
                    (item.delete && item.checked ? 'text-gray' : 'text-green')
                  ">
                    ￥{{ item.real_rent }}
                  </view>
                </view>
              </view>
            </tui-list-cell>
            <view class="tui-order-menu">
              <view class="">
                <view class="">
                  <text class="text-grey">类型：</text>
                  <text v-if="item.bill_type==1">签约</text>
                  <text v-if="item.bill_type==2">勘察</text>
                  <text v-if="item.bill_type==3">人工</text>
                </view>
              </view>
              <view class="">
                <view>
                  <tui-button @click="deleteConfirm" width="120rpx" height="50rpx" :size="16" type="gray-danger"
                    :index="index">删除</tui-button>
                </view>
              </view>
              <view class="">
                <view :class="[item.approved ? 'text-green' : 'text-orange']">
                  <span class="iconfont" :class="[
                      item.approved ? 'icon-tongguo' : 'icon-ceshijieguo-weitongguo',
                    ]"></span>
                  {{ item.approved ? "已通过" : "未通过" }}
                </view>
              </view>
            </view>
          </view>
        </block>
        <block>
          <view class="nodata">
            <img class="nodataImg" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
          </view>
        </block>
      </view>

      <!-- 删除账单模态框 -->
      <tui-modal :show="showDeleteConfirm" @click="handleDeleteConfirm" @cancel="hideDeleteTip" content="确定要删除吗？"
        :button="delteButtonArr"></tui-modal>
      <!-- 删除账单模态框 -->
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
        TabCur: 0,
        scrollLeft: 0,
        keyword: "",
        inited: false,
        pendingBills: {
          page: 0,
          pageSize: 20,
          list: [],
        },
        processedBills: {
          page: 0,
          pageSize: 20,
          list: [],
        },
        delteButtonArr: [{
            text: "取消",
            type: "primary",
            plain: true,
          },
          {
            text: "确定",
            type: "primary",
          },
        ],
        showDeleteConfirm: false,
      };
    },

    async onLoad(e) {
      this.inited = false;
      this.loadingCpt(true);
      await this.getPendingBills();
      await this.getProcessedBills();
      this.loadingCpt(false);
      this.inited = true;
    },

    async onPullDownRefresh() {
      await this.getPendingBills();
      await this.getProcessedBills();
      uni.stopPullDownRefresh();
    },

    methods: {
      async getPendingBills() {
        await this.http
          .post("/bill/list", {
            data: {
              page: this.page,
              pageSize: this.pageSize,
              // bill_type: 1,
              keyword: this.keyword,
              checked: false,
            },
          })
          .then((res) => {
            console.log(res.data);
            this.pendingBills.list = res.data.item;
            return res.data;
          });
      },
      async getProcessedBills() {
        await this.http
          .post("/bill/list", {
            data: {
              page: this.processedBills.page,
              pageSize: this.processedBills.pageSize,
              // bill_type: 1,
              keyword: this.keyword,
              checked: true,
            },
          })
          .then((res) => {
            console.log(res.data);
            this.processedBills.list = res.data.item;
            return res.data;
          });
      },

      // 流水订单通过或不通过
      async handleBills(e) {
        console.log(e);
        var {
          operate
        } = e.currentTarget.dataset;
        var {
          index
        } = e.currentTarget.dataset;
        var {
          bill_number
        } = e.currentTarget.dataset;
        console.log(operate, index);
        this.loadingCpt(true);
        if (operate == 1) {
          await this.http
            .post("/bill/check", {
              data: {
                bill_number: bill_number,
                operate: operate,
              },
            })
            .then((res) => {
              console.log(res);
              this.showTips(res.msg, "success");
              this.pendingBills.list.splice(index, 1);
              return res.data;
            });
        } else if (operate == 2) {
          uni.showModal({
            title: "提示",
            content: "确认删除吗？",
            showCancel: true,
            success: async ({
              confirm,
              cancel
            }) => {
              if (confirm) {
                await this.http
                  .post("/bill/delete", {
                    data: {
                      bill_number: bill_number,
                    },
                  })
                  .then((res) => {
                    console.log(res);
                    this.showTips(res.msg, "success");
                    this.pendingBills.list.splice(index, 1);
                    return res.data;
                  });
              }
            },
          });
        }
        this.loadingCpt(false);
      },

      // 删除确认框
      async handleDeleteConfirm(e) {
        let {
          index
        } = e;
        if (index == 0) {
          console.log("取消");
          this.showDeleteConfirm = false;
        } else if (index == 1) {
          this.http
            .post("/bill/check", {
              data: {
                bill_number: bill_number,
                operate: 2,
              },
            })
            .then((res) => {
              console.log(res);

              return res.data;
            });
        }
        return index;
      },

      deleteConfirm(e) {
        let {
          index
        } = e;
        uni.showModal({
          title: "提示",
          content: "确认删除吗？",
          showCancel: true,
          success: ({
            confirm,
            cancel
          }) => {
            if (confirm) {
              this.http
                .post("/bill/delete", {
                  data: {
                    bill_number: this.processedBills.list[index].bill_number,
                  },
                })
                .then((res) => {
                  console.log(res);
                  this.showTips(res.msg, "success");
                  this.processedBills.list.splice(index, 1);
                  return res.data;
                });
            }
          },
        });
      },

      hideDeleteTip() {
        this.showDeleteConfirm = false;
      },
      async tabSelect(e) {
        let index = e.currentTarget.dataset.id;
        this.TabCur = index;
        this.scrollLeft = (index - 1) * 60;
        if (index == 0) {
          this.pendingBills = {
            page: 0,
            pageSize: 20,
            list: [],
          };
          this.loadingCpt(true);
          await this.getPendingBills();
          this.loadingCpt(false);
        } else if (index == 1) {
          this.processedBills = {
            page: 0,
            pageSize: 20,
            list: [],
          };
          this.loadingCpt(true);
          await this.getProcessedBills();
          this.loadingCpt(false);
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
<style>
  .tui-order-item {
    margin-top: 20rpx;
    margin-left: 10rpx;
    margin-right: 10rpx;
    border-radius: 10rpx;
    overflow: hidden;
    box-shadow: 6rpx 6rpx 18rpx 4rpx #6b6b6b4a;
  }

  .tui-goods-title {
    width: 100%;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tui-order-status {
    color: #888;
    font-size: 26rpx;
  }

  .tui-goods-item {
    width: 100%;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

  .tui-goods-img {
    width: 200rpx;
    display: flex;
    align-items: flex-start;
    max-height: 200rpx;
    overflow: hidden;
    flex-shrink: 0;
  }

  .tui-goods-center {
    flex: 1;
    padding: 0rpx 8rpx;
    box-sizing: border-box;
  }

  .tui-goods-name {
    font-size: 28rpx;
    line-height: 32rpx;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .tui-goods-attr {
    font-size: 26rpx;
    color: #888888;
    line-height: 32rpx;
    padding-top: 20rpx;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .tui-goods-price {
    font-size: 24rpx;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-align-last: right;
  }

  .tui-order-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 10rpx 30rpx 20rpx;
    box-sizing: border-box;
  }

  .tui-order-menu {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
    background: #fff;
    padding: 10rpx 30rpx 20rpx;
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
