<!-- 薪资排行 -->
<template>
  <view>
    <cu-custom bgColor="bg-blue-10" :isCustom="true">
      <view slot="content">排行榜</view>
    </cu-custom>
    <view class="contaier bg-white">
      <view class="top_bg" :style="
          'background-image: url(https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/pages/rank/rank_bg_' +
          (isNight ? 'night' : 'day') +          '.jpg)'
        ">
        <view class="one_box">
          <!-- 第二名 -->
          <view class="top3">
            <view class="num_two" v-if="rankList.length >= 2">
              <image class="huangguan2" src="/static/pages/rank/two.png"></image>
              <image class="top3_head bg-white" :src="rankList[1].avatar_url"></image>
              <!-- <view class="top_name">{{twoName}}</view> -->
              <view class="top_name">{{ rankList[1].realName }}</view>
              <view class="top_sy">
                <view class="text-lg text-weight-600 text-xxl">
                  <span>{{ rankList[1].bill_total }} 元</span>
                </view>
                <view class="text-xs text-weight-200">
                  <span>{{ rankList[1].bill_count }} 单</span>
                </view>
              </view>
            </view>
          </view>

          <!-- 第一名 -->
          <view class="top3">
            <view class="num_one" v-if="rankList.length >= 1">
              <image class="huangguan1" src="/static/pages/rank/one.png"></image>
              <image class="top3_head bg-white" :src="rankList[0].avatar_url"></image>
              <!-- <view class="top_name" style="font-size: 30rpx;">{{oneName}}</view> -->
              <view class="top_name" style="font-size: 30rpx">{{
                rankList[0].realName
              }}</view>
              <view class="top_sy">
                <view class="text-lg text-weight-600 text-xxl">
                  <span>{{ rankList[0].bill_total }} 元</span>
                </view>
                <view class="text-xs text-weight-200">
                  <span>{{ rankList[0].bill_count }} 单</span>
                </view>
              </view>
            </view>
          </view>

          <!-- 第三名 -->
          <view class="top3">
            <view class="num_three" v-if="rankList.length >= 3">
              <image class="huangguan2" src="/static/pages/rank/three.png"></image>
              <image class="top3_head bg-white" :src="rankList[2].avatar_url"></image>
              <view class="top_name">{{ rankList[2].realName }}</view>
              <view class="top_sy">
                <view class="text-lg text-weight-600 text-xxl">
                  <span>{{ rankList[2].bill_total }} 元</span>
                </view>
                <view class="text-xs text-weight-200">
                  <span>{{ rankList[2].bill_count }} 单</span>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="number_sy_box">
          <view class="number_sy_box_title">
            <text>业绩·统计</text>
            <text style="
                position: absolute;
                right: 20rpx;
                z-index: 9999;
                font-size: 24rpx;
                color: #c3c3c3;
              ">
              截止：{{ nowTime }}
            </text>
          </view>
          <view class="number_sy_main">
            <view style="width: 50%; text-align: center;z-index:9; border-right: 1px solid #eee">
              <view class="number_num1">{{ userRanking.bill_total||0 }}元</view>
              <view class="danwei">您的签约业绩</view>
            </view>
            <view style="width: 50%; text-align: center;z-index:9;border-right: 1px solid #eee">
              <view class="number_num2">第{{ userRanking.ranking||0 }}名 </view>
              <view class="danwei">你的排名</view>
            </view>
            <view style="width: 50%; text-align: center;z-index:9">
              <view class="number_num2">签 {{ userRanking.bill_sign_count||0 }} | 勘
                {{ userRanking.bill_survey_count||0 }}
              </view>
              <view class="danwei text-sm">详细单数</view>
            </view>
            <image mode="widthFix" class="xiaoding_bg" src="/static/pages/rank/Intersect.png"></image>
          </view>
        </view>
      </view>

      <view class="rankList_box" v-if="rankList.length > 3">
        <view class="rankItem" v-for="(item, index) in rankList.slice(3)" :key="index">
          <view class="rankIndex">
            <text>{{ index + 4 }}</text>
          </view>
          <view class="HeardBox">
            <image class="rankHeard" :src="item.avatar_url"></image>
          </view>
          <view class="NameBox">
            <view class="userName">{{ item.realName }}</view>
            <view class="userPost text-gray">
              <!-- {{ utils.role2Text(item.role) }} -->
            </view>
            <view class="color_ccc">{{ item.bill_count }} 单 ｜
              <text class="text-blue text-lg">{{ item.bill_total }}</text>元
            </view>
          </view>
          <view class="download_box">
            <!-- 待替换 -->
          </view>
        </view>
      </view>

    </view>
    <tui-bottom-navigation :current="btmNavCurrent" :itemList="btmNavList" @click="btmNav" subMenuBgColor="#4c4c4c"
      :splitLineScale="false" subMenuColor="#fff" :subMenuHover="false" :unlined="false"></tui-bottom-navigation>
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
        nowTime: "2022-12-31",
        userinfo: {},
        page: 0,
        pageSize: 100,
        keyword: "",
        date_range: "month",
        rankList: [{
            avatar_url: "",
            bill_count: 17,
            bill_total: 55620,
            realName: "",
          },
          {
            avatar_url: "",
            bill_count: 17,
            bill_total: 55620,
            realName: "",
          },
          {
            avatar_url: "",
            bill_count: 17,
            bill_total: 55620,
            realName: "",
          },
        ],
        userRanking: {},
        btmNavCurrent: 1,
        btmNavList: [{
            text: "周排行",
            color: "#666",
            //1-选中切换，2-跳转、请求、其他操作，3-菜单
            type: 1,
            parameter: "week",
          },
          {
            text: "月排行",
            color: "#666",
            //1-选中切换，2-跳转、请求、其他操作，3-菜单
            type: 1,
            parameter: "month",
          },
          {
            text: "历史",
            iconPath: "/static/iconfont/icon/list.png",
            selectedIconPath: "/static/iconfont/icon/list_blue.png",
            color: "#666",
            //1-选中切换，2-跳转、请求、其他操作，3-菜单
            type: 3,
            //自定义参数，类型自定义
            parameter: null,
            //子菜单left值,不传默认50%,当菜单贴近左右两边可用此参数调整
            popupLeft: "",
            itemList: [{
                //不建议超过6个字，请自行控制
                text: "上周",
                //自定义参数，类型自定义
                parameter: "last_week",
              },
              {
                text: "上月",
                //自定义参数，类型自定义
                parameter: "last_month",
              },
              {
                text: "查看更多",
                //自定义参数，类型自定义
                parameter: "more",
                type: 2,
              },
            ],
          },
        ],
      };
    },
    onLoad() {
      this.getData();
      this.getStaffBill();
      this.userinfo = uni.getStorageSync("userInfo");
      // 是否进入夜晚模式
      this.isNight = new Date().getHours() >= 18 || new Date().getHours() <= 6;
    },
    methods: {
      async getData() {
        this.loadingCpt(true);
        await this.http
          .get("/bill/rank", {
            data: {
              page: this.page,
              pageSize: this.pageSize,
              keyword: this.keyword,
              date_range: this.date_range,
            },
          })
          .then((res) => {
            console.log(res);
            this.rankList = res.data.item;
          })
          .catch((err) => {
            console.log(err);
          });
        this.loadingCpt(false);
      },

      async getStaffBill() {
        this.loadingCpt(true);
        await this.http
          .get("/bill/rank/staff", {
            data: {
              date_range: this.date_range,
            },
          })
          .then((res) => {
            console.log(res);
            this.userRanking = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
        this.loadingCpt(false);
      },
      btmNav(e) {
        console.log(e);
        console.log(typeof e.index);
        let index = e.index;
        let subIndex = e.subIndex;
        if (index == 2 && subIndex == 2) {
          this.showTips("暂无更多", "gray", "bottom");
          return;
        }
        this.btmNavCurrent = e.index;
        this.date_range = e.parameter;
        this.getStaffBill();
        this.getData();
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
    },
  };
</script>

<style lang="scss">
  .contaier {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    top: 0;
  }

  .top_bg {
    width: 750rpx;
    height: 550rpx;
    background-size: 750rpx;
    position: relative;
  }

  .one_box {
    width: 750rpx;
    height: 260rpx;
    position: absolute;
    left: 0;
    bottom: 140rpx;
    display: flex;
    justify-content: space-around;
  }

  .one_box .top3 {
    width: 210rpx;
    height: 280rpx;
  }

  .top_name {
    width: 100%;
    height: 55rpx;
    line-height: 60rpx;
    color: #f2f2f2;
    font-size: 26rpx;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .top_sy {
    width: 100%;
    height: 80rpx;
    line-height: 40rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 1);
    text-shadow: 1rpx 1rpx 22rpx rgba(0, 0, 0, 0.5);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .num_one {
    position: relative;
  }

  .huangguan1 {
    width: 60px;
    height: 60px;
    position: absolute;
    right: -10rpx;
    top: -18 * 2rpx;
  }

  .num_one .top3_head {
    width: 150rpx;
    height: 150rpx;
    border-radius: 100%;
    margin: 15rpx 0 0 30rpx;
    border: 4rpx solid #ffdd3c;
  }

  .num_two {
    position: relative;
  }

  .huangguan2 {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    right: 15rpx;
  }

  .num_two .top3_head {
    width: 120rpx;
    height: 120rpx;
    border-radius: 100%;
    margin: 45rpx 0 0 45rpx;
    border: 4rpx solid #bcdcdf;
  }

  .num_three {
    position: relative;
  }

  .huangguan2 {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    right: 15rpx;
  }

  .num_three .top3_head {
    width: 120rpx;
    height: 120rpx;
    border-radius: 100%;
    margin: 45rpx 0 0 45rpx;
    border: 4rpx solid #e29d85;
  }

  // 第二块
  .number_sy_box {
    width: 700rpx;
    height: 210rpx;
    background-color: #ffffff;
    position: absolute;
    left: 25rpx;
    border-radius: 20rpx;
    bottom: -115rpx;
    z-index: 99;
    padding: 22rpx;
    box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.1);
  }

  .number_sy_box_title {
    color: #888888;
    // font-weight: 500;
    font-size: 28rpx;
    display: flex;
    z-index: 9999;
    justify-content: space-between;
  }

  .number_sy_main {
    width: 100%;
    height: 124rpx;
    padding-top: 20rpx;
    line-height: 52rpx;
    // background: red;
    display: flex;
    justify-content: space-around;
    position: relative;
  }

  .xiaoding_bg {
    position: absolute;
    right: -22rpx;
    bottom: -30rpx;
    width: 180rpx;
    overflow: hidden;
    filter: blur(1px);
    opacity: 0.7;
  }

  .number_num1 {
    font-size: 40rpx;
    font-weight: 500;
    color: #2fc04f;
  }

  .number_num2 {
    font-size: 40rpx;
    font-weight: 500;
    color: #4bac7f;
  }

  .danwei {
    height: 60rpx;
    line-height: 60rpx;
    font-size: 26rpx;
    color: #c9c9c9;
  }

  // 列表
  .rankList_box {
    z-index: 999;
    width: 750rpx;
    position: absolute;
    height: calc(100% - 490rpx);
    overflow-y: scroll;
    min-height: 200rpx;
    margin-top: 110rpx;
    padding-bottom: 400rpx;
  }

  .rankItem:last-child {
    border: none;
  }

  .rankItem {
    width: 700rpx;
    height: 140rpx;
    margin: 0px auto;
    border-bottom: 1px solid #e9e9e9;
  }

  .rankIndex {
    width: 60rpx;
    height: 140rpx;
    line-height: 140rpx;
    text-align: center;
    color: #cccccc;
    font-size: 40rpx;
    float: left;
  }

  .HeardBox {
    width: 100rpx;
    height: 100rpx;
    margin: 20rpx;
    border-radius: 100%;
    overflow: hidden;
    float: left;
    margin-right: 25rpx;
    margin-left: 10rpx !important;
  }

  .HeardBox image {
    width: 100%;
    height: 100%;
  }

  .NameBox {
    width: 400rpx;
    height: 140rpx;
    float: left;
    padding-top: 10rpx;
    box-sizing: border-box;
  }

  .NameBox view {
    height: 50rpx;
    line-height: 70rpx;
  }

  .userName {
    min-width: 90rpx;
    font-size: 30rpx;
    float: left;
    margin-right: 20rpx;
  }

  .download_box {
    width: 80rpx;
    height: 140rpx;
    // background-color: red;
    float: right;
  }

  .download_box image {
    width: 45rpx;
    margin: 50rpx auto;
    display: block;
  }
</style>
