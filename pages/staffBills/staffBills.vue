<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <view slot="content">流水记录</view>
    </cu-custom>
    <view class="container">
      <scroll-view scroll-x class="bg-white nav">
        <view class="flex text-center">
          <view :class="'cu-item flex-sub ' + (TabCur == 0 ? 'text-blue cur' : '')" @tap="tabSelect" :data-id="0">
            待审核
          </view>
          <view :class="'cu-item flex-sub ' + (TabCur == 1 ? 'text-blue cur' : '')" @tap="tabSelect" :data-id="1">
            已通过
          </view>
        </view>
      </scroll-view>

      <view :hidden="!(TabCur == 0)">
        <block v-if="pendingBills.list.length">
          <view v-for="(item, index) in pendingBills.list" :key="index" class="tui-order-item shadow">
            <tui-list-cell :hover="false" :lineLeft="false">
              <view class="tui-goods-title">
                <view class="text-grey text-cut text-sm">流水单号：{{ item.bill_number }} </view>
                <view class="tui-order-status">{{ item.at_create_humanize }}</view>
              </view>
            </tui-list-cell>
            <tui-list-cell padding="0">
              <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.house.houseId" hover-class="none">
                <view class="tui-goods-item">

                  <view class="tui-goods-center">
                    <view class="tui-goods-name">{{ item.house.title }}</view>
                    <view class="tui-goods-attr">
                      <block v-if="
                          (item.house.houseType.rooms == 1) &
                          (item.house.houseType.halls == 0)
                        ">
                        <span class="text-grey">{{ item.house.houseNum }}室 • 单间 • {{ item.house.area }}m² • 楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</span>
                      </block>
                      <block v-else>
                        <span class="text-grey">{{ item.house.houseNum }}室 • {{item.house.houseType.rooms}}房{{ item.house.houseType.halls }}厅{{item.house.houseType.toilets}}卫 • {{ item.house.area  }}m² • 楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</span>
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
                  <view class="text-xl text-orange"> ￥{{ item.real_rent }} </view>
                </view>
              </view>
            </tui-list-cell>
            <view class="tui-order-btn">
              <view class="">
                <view class="">
                  <text class="text-grey text-sm">类型：</text>
                  <text v-if="item.bill_type==1">签约</text>
                  <text v-if="item.bill_type==2">勘察</text>
                  <text v-if="item.bill_type==3">人工</text>
                </view>
              </view>
              <view class="">
              </view>
              <view class="">
                <button class="line-red radius text-sm padding-lr-lg" @tap="handleBills" :data-index="index" :data-operate="2" :data-bill_number="item.bill_number">
                  撤销
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
                <view class="tui-order-status">{{ item.at_create_humanize }}</view>
              </view>
            </tui-list-cell>
            <tui-list-cell padding="0">
              <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.house.houseId" hover-class="none">
                <view class="tui-goods-item">
                  <view class="tui-goods-center">
                    <view class="tui-goods-name">{{ item.house.title }}</view>
                    <view class="tui-goods-attr">
                      <block v-if="
                          (item.house.houseType.rooms == 1) &
                          (item.house.houseType.halls == 0)
                        ">
                        <view class="text-grey">{{ item.house.houseNum }}室 • 单间 • {{ item.house.area }}m² • 楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</view>
                      </block>
                      <block v-else>
                        <view class="text-grey">{{ item.house.houseNum }}室 • {{ item.house.houseType.rooms }}房{{item.house.houseType.halls}}厅{{ item.house.houseType.toilets }}卫 • {{ item.house.area }}m² • 楼{{ item.house.floor.atFloor }}/{{item.house.floor.totalFloor}}</view>
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
                  <text class="text-grey text-sm">类型：</text>
                  <text v-if="item.bill_type==1">签约</text>
                  <text v-if="item.bill_type==2">勘察</text>
                  <text v-if="item.bill_type==3">人工</text>
                </view>
              </view>
              <view class="">
              </view>
              <view class="">
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
      delteButtonArr: [
        {
          text: "取消",
          type: "primary",
          plain: true,
        },
        {
          text: "确定",
          type: "primary",
        },
      ],
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
        .post("/bill/staff/list", {
          data: {
            page: this.page,
            pageSize: this.pageSize,
            bill_type: 0,
            keyword: this.keyword,
            checked: false,
            approved: false,
          },
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.pendingBills.list = res.data.item;
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getProcessedBills() {
      await this.http
        .post("/bill/staff/list", {
          data: {
            page: this.page,
            pageSize: this.pageSize,
            bill_type: 0,
            keyword: this.keyword,
            checked: true,
            approved: true,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.processedBills.list = res.data.item;
          return res.data;
        });
    },

    // 撤销申请流水
    async handleBills(e) {
      console.log(e);
      var { operate } = e.currentTarget.dataset;
      var { index } = e.currentTarget.dataset;
      var { bill_number } = e.currentTarget.dataset;

      uni.showModal({
        title: "提示",
        content: "确认撤销吗？",
        showCancel: true,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            await this.http
              .post("/bill/staff/delete", {
                data: {
                  bill_number: bill_number,
                },
              })
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.showTips(res.msg, "success");
                  this.pendingBills.list.splice(index, 1);
                } else {
                  this.showTips(res.msg, "warning");
                }
                return res.data;
              });
          }
        },
      });

      this.loadingCpt(false);
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
    showTips: function (
      msg = "成功",
      type,
      position = "center",
      duration = 1500
    ) {
      this.tipsColor = this.utils.text2Color(type);
      this.tipsPosition = position;
      this.$refs[`tips${position}`].showTips({ msg: msg, duration: duration });
    },
    loadingCpt: function (operate = false, loadingText = "加载中...") {
      this.showloading = operate;
      this.loadingText = loadingText;
    },
  },
};
</script>
<style scoped>


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
