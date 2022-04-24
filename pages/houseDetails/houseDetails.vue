<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">房屋详情</view>
    </cu-custom>

    <swiper :class="'screen-swiper round-dot'" indicator-dots="true" circular="true" autoplay="true" interval="20000"
      duration="600">
      <swiper-item v-for="(item, index) in house.videoUrl" :key="index" @tap="previewVideo" :data-index="index">
        <video :src="item.url" autoplay loop muted show-play-btn="false" controls="false" objectFit="cover"></video>
      </swiper-item>
      <swiper-item v-for="(item, index) in house.imgUrl" :key="index" @tap="previewImage" :data-index="index">
        <image :src="item+'?x-oss-process=style/compress'" mode="aspectFill" v-if="item.type!='image'"></image>
      </swiper-item>
      <swiper-item v-if="house.imgUrl.length==0">
        <image src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png" mode="aspectFill">
        </image>
      </swiper-item>
    </swiper>

    <view class="cu-bar bg-white solid-bottom">
      <view class="text-xl text-black padding-lr" @tap="copyTxt" :data-copyText="house.title" :data-time="lastTapTime">
        {{house.title}}
      </view>
      <view class="action">
        <text :class="(house.isTop?'text-blue':'text-gray') + ' text-blue cuIcon-top'" @tap="handleTop"></text>
        <text :class="(isCollect?'cuIcon-favorfill':'cuIcon-favor') + ' text-blue'" @tap="handleCollect"></text>
        <span class="iconfont icon-qu text-blue padding-left-sm" @tap="handlePartition"></span>
      </view>
    </view>

    <view class="padding flex text-center text-grey bg-white solid-bottom">
      <view class="flex flex-sub flex-direction solid-right">
        <view class="text-lg text-red">{{house.rent}}元/月</view>
        <view class="margin-top-sm text-sm">
          <span class="iconfont icon-fangwuzujin text-grey"></span>
          租金
        </view>
      </view>
      <view class="flex flex-sub flex-direction solid-right">
        <view class="text-lg text-red">
          {{house.houseType.rooms}}室{{house.houseType.halls}}厅{{house.houseType.toilets}}卫
        </view>
        <view class="margin-top-sm text-sm">
          <span class="iconfont icon-huxing text-grey"></span>
          户型
        </view>
      </view>
      <view class="flex flex-sub flex-direction solid-right">
        <view class="text-lg text-red">{{house.area}}m²</view>
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
          <view class>
            {{house.floor.atFloor}}/{{house.floor.totalFloor}}层
          </view>
        </view>
        <view class="flex flex-sub margin-xs radius">
          <view class="text-grey">
            <span class="iconfont icon-number text-grey"></span>
            房号：
          </view>
          <view class>
            {{house.houseNum}}室
          </view>
        </view>
      </view>
      <view class="flex">
        <view class="flex flex-sub margin-xs radius">
          <view class="text-grey">
            <span class="iconfont icon-jiancefangfa text-grey"></span>
            用途：
          </view>
          <view class>
            {{house.useWay}}
          </view>
        </view>
        <view class="flex flex-sub margin-xs radius">
          <view class="text-grey">
            <span class="iconfont icon-zhifufangshi1 text-grey"></span>
            支付：
          </view>
          <view class>
            押{{utils.numTran(house.payMethod.mortgage)}}付{{utils.numTran(house.payMethod.pay)}}
          </view>
        </view>
      </view>
    </view>

    <view class="padding-sm flex flex-wrap bg-white">
      <view class="padding-xs">
        <view v-for="(item, index) in house.tags" :key="index" class="cu-tag bg-grey light margin-xs">{{item}}
        </view>
      </view>
    </view>

    <block>
      <view class="cu-bar bg-white margin-top-sm solid-bottom">
        <view class="action">
          <span class="iconfont icon-jigouguanli text-blue margin-right-sm"></span>
          机构信息
        </view>
      </view>
      <view class="bg-white padding container flex flex-direction">
        <view class="flex-sub  position-item padding-bottom-xs">
          <view class="fl text-grey" style="width:100rpx">
            房东：
          </view>
          <view class="fl" style="width:calc(100% - 100rpx)">
            <view @longpress="allotlandlordHouse" :data-copyText="house.landlord" :data-time="lastTapTime">
              {{house.landlord}}
            </view>
          </view>
        </view>
        <view class="flex-sub  position-item padding-tb-xs">
          <view class="fl text-grey" style="width:100rpx">
            电话：
          </view>
          <view class="fl" style="width:calc(100% - 100rpx)">
            <view @tap="makeCellPhone" :data-phone="house.phone">
              {{house.phone}}
            </view>
          </view>
        </view>
      </view>
    </block>

    <view class="cu-bar bg-white margin-top-sm solid-bottom">
      <view class="action">
        <span class="iconfont icon-round text-blue margin-right-sm"></span>
        位置周边
      </view>
    </view>

    <view class="bg-white padding container flex flex-direction">
      <view class="flex-sub  position-item padding-bottom-xs">
        <view class="fl text-grey" style="width:100rpx">
          地址：
        </view>
        <view class="fl" style="width:calc(100% - 100rpx)">
          <view @tap="copyTxt"
            :data-copyText="house.region.province + '-' + house.region.city + '-' + house.region.area + '-' + house.address"
            :data-time="lastTapTime">
            {{house.region.province}}-{{house.region.city}}-{{house.region.area}}-{{house.address}}
          </view>
        </view>
      </view>
      <view class="flex-sub  position-item padding-tb-xs">
        <view class="fl text-grey" style="width:100rpx">
          地段：
        </view>
        <view class="fl" style="width:calc(100% - 100rpx)">
          <view>
            <view v-for="(item, index) in house.districts" :key="index" class="fl" @tap="copyTxt" :data-copyText="item"
              :data-time="lastTapTime">
              {{item}}
              <text v-if="index!=(house.districts.length-1)">、</text>
            </view>
          </view>
        </view>
      </view>
      <view class="flex-sub  position-item padding-tb-xs">
        <view class="fl text-grey" style="width:100rpx">
          地铁：
        </view>
        <view class="fl" style="width:calc(100% - 100rpx)">
          <view v-for="(item, index) in house.subways" :key="index" class="padding-tb-xs" @tap="copyTxt"
            :data-copyText="item" :data-time="lastTapTime">
            {{item}}
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
    <view class="bg-white padding container flex flex-direction">
      <view class="flex-sub position-item padding-bottom-xs">
        <view class="fl text-grey" style="width:150rpx">
          修改：
        </view>
        <view class="fl" style="width:calc(100% - 150rpx)">
          <view>
            {{house.at_update?house.at_update:house.at_create}}
          </view>
        </view>
      </view>
      <view class="flex-sub position-item padding-bottom-xs">
        <view class="fl text-grey" style="width:150rpx">
          创建：
        </view>
        <view class="fl" style="width:calc(100% - 150rpx)">
          <view>
            {{house.at_create}}
          </view>
        </view>
      </view>
      <view class="flex-sub position-item padding-bottom-xs">
        <view class="fl text-grey" style="width:150rpx">
          状态：
        </view>
        <view class="fl" style="width:calc(100% - 150rpx)">
          <view>
            {{house.isRented?'已租':'未租'}}
          </view>
        </view>
      </view>
      <view class="flex-sub position-item padding-bottom-xs">
        <view class="fl text-grey" style="width:150rpx">
          签约：
        </view>
        <view class="fl" style="width:calc(100% - 150rpx)">
          <view>
            {{isSignUp?'已签约':'未签约'}}
          </view>
        </view>
      </view>
      <view class="flex-sub position-item padding-bottom-xs" v-if="false">
        <view class="fl text-grey" style="width:150rpx">
          到期：
        </view>
        <view class="fl" style="width:calc(100% - 150rpx)">
          <view>
            {{dueTime}}
          </view>
        </view>
      </view>
    </view>

    <!-- <tui-fab left="{{0}}" right="{{80}}" bottom="{{200}}" bgColor="{{'#0081ff'}}" btnList="{{btnList}}" bind:click="onClick"></tui-fab> -->

    <block>
      <view class="updateButton">
        <!-- <navigator :url="'/pages/updateHouse/index?houseId=' + house.houseId" hover-class="">
          <button class="cu-btn bg-blue shadow-blur">
            <span class="iconfont icon-xiugai text-white"></span>
            <text class="text">修改</text>
          </button>
        </navigator> -->
        <view class="">
          <button class="cu-btn bg-blue shadow-blur" @tap="copyHouse">
            <span class="iconfont icon-moban2 text-white"></span>
            <text class="text">模板</text>
          </button>
        </view>
      </view>

    </block>

    <block>
      <view class="cu-bar tabbar border shop foot " style="background-color: #ffffffee">
        <navigator :url="'/pages/houseFeedback/houseFeedback?houseId='+house.houseId" hover-class="">
          <button class="action">
            <view style="padding-bottom: 10upx">
              <span class="iconfont icon-qianyue"></span>
            </view>
            <view> 房源反馈 </view>
          </button>
        </navigator>
        <navigator :url="'/pages/updateHouse/updateHouse?houseId='+house.houseId" hover-class="">
          <button class="action">
            <view style="padding-bottom: 10upx">
              <span class="iconfont icon-xiugai text-blue"></span>
            </view>
            <view> 修改</view>
          </button>
        </navigator>
        <view class="btn-group">
          <button @tap="alterIsRented" class="cu-btn round shadow-blur lg"
            :class="house.isRented?'bg-orange':'bg-yellow'">{{house.isRented?"改未租":"改已租"}}</button>
          <button @tap="toggleShowQrCode" class="cu-btn bg-blue lg round shadow-blur">
            <span class="iconfont icon-qianyue padding-right-sm"></span>签约
          </button>
        </view>
      </view>
    </block>

    <view class="padding-xl"></view>
    <tui-modal :show="isShowQrCode" @cancel="toggleShowQrCode" :custom="true">
      <view class="tui-modal-custom">
        <image
          :src="userInfo.payCode?userInfo.payCode:'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/qr_code.jpg'"
          mode="widthFix" class="tui-tips-img"></image>
        <view class="grid col-2">
          <view class="text-center">
            <button class="cu-btn radius bg-blue shadow padding-lr-xl" @tap="toggleShowQrCode">取消</button>
          </view>
          <view class=" text-center">
            <button class="cu-btn radius bg-blue shadow padding-lr-xl" @tap="toggleShowForm">已付</button>
          </view>
        </view>
      </view>
    </tui-modal>

    <tui-modal :show="isShowForm" @cancel="toggleShowForm" :custom="true" :fadeIn="true">
      <view class="align-start" :hidden="!isShowForm">
        <view class="padding-bottom text-xl text-center">收款信息</view>
        <view class="cu-form-group">
          <view class="title">签约人：</view>
          <input placeholder="签约人" :value="userInfo.realName" disabled>
        </view>
        <view class="cu-form-group">
          <view class="title">实租价：</view>
          <input placeholder="实付租价" :value="billInfo.real_rent" @input="inputBillInfo" data-input="real_rent"
            type="number">
        </view>
        <view class="cu-form-group">
          <view class="title">付款人：</view>
          <input placeholder="付款人姓名" :value="billInfo.payer" @input="inputBillInfo" data-input="payer">
        </view>
        <view class="cu-form-group">
          <view class="title">备 注：</view>
          <input placeholder="默认无" :value="billInfo.remarks" @input="inputBillInfo" data-input="remarks">
        </view>

        <view class="flex align-center padding-tb">
          <button class="bg-blue round shadow text-sm padding-tb-0 padding-lr-lg animation-shake"
            @tap="addBill">立即提交</button>

        </view>
      </view>
    </tui-modal>
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
        house: {
          id: 0,
          houseId: "",
          title: "",
          imgUrl: [],
          videoUrl: [{}],
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
        payArr: [
          "零",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九",
          "十",
        ],
        isCollect: false,
        isShowQrCode: false,
        isShowForm: false,
        isSignUp: false,
        userInfo: {
          a: 1,
          avatarUrl: "",
          b: 2,
          city: "",
          country: "",
          gender: 1,
          language: "",
          name: "",
          nickName: "",
          province: "",
        },
        billInfo: {
          houseId: "",
          real_rent: "",
          pay_type: "",
          payer: "",
          remarks: "",
        },
        power: "",
        token: "",
        lastTapTime: "",
      };
    },

    props: {},

    async onLoad(params) {
      // 所需数据初始化
      let houseId = params.houseId || "d0081bfe95654adb92be53b2b5a65610"
      let house = params.house
      if (house) {
        this.house = JSON.parse(decodeURIComponent(house))
      }
      this.init(); //获取house信息
      await this.getHouse(houseId); //查询是否已经收藏
      this.queryIsCollect(houseId); //获取最新个人信息（收款码和名字）
    },

    async onPullDownRefresh() {
      await this.getHouse(this.house.houseId);
      this.queryIsCollect(this.house.houseId);
      this.userInfo = uni.getStorageSync("userInfo");
      uni.stopPullDownRefresh();
    },

    methods: {
      init() {
        this.power = uni.getStorageSync("power");
        this.userInfo = uni.getStorageSync("userInfo");
        this.token = uni.getStorageSync("token");
      },

      async getHouse(houseId) {
        // this.loadingCpt(true);
        console.log(houseId);
        let house = await this.http
          .get("/house/detail", {
            data: {
              houseId: houseId,
              showloading: true,
            },
          })
          .then((res) => {
            if (res.code == 200) {
              this.house = res.data;
              return res.data;
            } else {
              this.showTips(res.msg, "warning");
            }
          });
        this.billInfo.real_rent = house.rent;
        // this.loadingCpt(false);
        console.log(house);
      },

      async handleCollect(e) {
        var houseId = this.house.houseId;
        let operate = 1;

        if (this.isCollect) {
          operate = 2;
        }
        await this.http
          .post("/house/collect", {
            data: {
              houseId: houseId,
              operate: operate,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.tui.toast(this.isCollect ? "取消收藏" : "已收藏");
              this.isCollect = !this.isCollect;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      // 分区按钮
      handlePartition() {
        uni.navigateTo({
          url: "/pages/housePartition/housePartition?address=" + this.house.address,
        });
      },

      //查询是否已经收藏
      async queryIsCollect(houseId) {
        await this.http
          .get("/house/collect/query", {
            data: {
              houseId: this.house.houseId,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.isCollect = res.data.isCollect;
            }
          })
          .catch((e) => {
            console.log(e);
          });
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

      //预览视频
      previewVideo(e) {
        /* #ifdef MP-WEIXIN */
        uni.previewMedia({
          sources: this.house.videoUrl,
          current: e.currentTarget.dataset.index,
        });
        /* #endif */
      },

      //修改租用状态
      async alterIsRented() {
        let houseId = this.house.houseId;
        let operate = 1;
        if (this.house.isRented) {
          operate = 2;
        }
        this.loadingCpt(true);
        await this.http
          .get("/house/isrented", {
            data: {
              houseId: houseId,
              operate: operate,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.house.isRented = res.data.isRented;
              console.log(this.house.isRented);
              this.tui.toast(res.msg);
            }
          })
          .catch((e) => {
            console.log(e);
          });
        this.loadingCpt(false);
      },

      toggleShowQrCode() {
        this.isShowQrCode = !this.isShowQrCode;
      },

      toggleShowForm() {
        if (this.isSignUp) {
          this.showTips("注意您可能重复签约", "warning");
        }
        this.isShowForm = !this.isShowForm;
        this.isShowQrCode = false;
      },

      inputBillInfo(e) {
        var {
          input
        } = e.currentTarget.dataset;
        var value = e.detail.value.trim();
        console.log(input + ":" + this.billInfo[input]);
        if (input == "real_rent") {
          value = Number(value);
        }
        this.billInfo[input] = value;
      },

      async addBill(e) {
        var {
          billInfo
        } = this;
        var {
          house
        } = this;
        billInfo.pay_type = 0;
        //#ifdef MP-WEIXIN
        billInfo.pay_type = 1;
        //#endif
        if (billInfo.real_rent && billInfo.payer) {
          this.loadingCpt(true);
          await this.http
            .post("/bill/sign_contract", {
              data: {
                houseId: house.houseId,
                payer: billInfo.payer,
                pay_type: billInfo.pay_type,
                real_rent: billInfo.real_rent,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.showTips("签约成功", "success");
                this.isShowForm = false;
                this.isSignUp = true;
              }
            })
            .catch((e) => {
              console.log(e);
            });

          if (!this.house.isRented) {
            this.alterIsRented();
          }
          this.loadingCpt(false);
        } else {
          this.showTips("输入有误！", "warning");
          console.log("输入有误！");
        }
      },

      copyTxt(e) {
        var curTime = e.timeStamp;
        var lastTime = e.currentTarget.dataset.time;
        var copyText = e.target.dataset.copytext;

        if (curTime - lastTime > 0) {
          if (curTime - lastTime < 300) {
            // 符合双击要求
            uni.setClipboardData({
              data: copyText,
            });
          }
        }
        this.lastTapTime = curTime;
      },

      makeCellPhone(e) {
        var phone = e.target.dataset.phone;
        console.log(e);
        console.log(phone);
        uni.makePhoneCall({
          phoneNumber: phone,
        });
      },

      showToast() {},

      copyHouse(e) {
        console.log(e);
        var houseTemplate = {
          template: this.house,
          time: new Date().getTime(),
          copied: false,
        };
        uni.setStorageSync("houseTemplate", houseTemplate);
        uni.navigateTo({
          url: "/pages/release/release",
        });
      },

      async handleTop(e) {
        var houseId = this.house.houseId;
        let operate = 1;

        if (this.house.isTop) {
          operate = 2;
        }
        await this.http
          .get("/house/top", {
            data: {
              houseId: houseId,
              operate: operate,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.tui.toast(this.house.isTop ? "取消置顶" : "已置顶");
              this.house.isTop = !this.house.isTop;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      // 按照房东配房
      async allotlandlordHouse(e) {
        uni.vibrateShort({
          success: function() {
            console.log('success');
          }
        });
        uni.showLoading()
        await this.http
          .post("house/allot", {
            data: {
              rule: {
                landlord: this.house.landlord,
                isRented: [false]
              },
              type: 2,
              expire: 2592000,//一个月
            },
          })
          .then((res) => {
            uni.hideLoading()
            console.log(res);
            if (res.code == 200) {
              // 复制到剪贴板
              uni.setClipboardData({
                data: "https://home.u-home.cc/user/#/pages/allotHouse/allotHouse?allot_id=" +
                  res.data.allot_id,
              });
              uni.showToast({
                title: "该房东房源已复制",
                icon: "none",
                duration: 1000,
              });
            }
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
          duration: duration
        });
      },
      loadingCpt: function(operate = false, loadingText = "加载中...") {
        this.showloading = operate;
        this.loadingText = loadingText;
      },
      href(url) {
        uni.navigateTo({
          url: "url"
        });
      },
    },
  };
</script>
<style scoped>
  swiper {
    width: 100%;
    height: 500rpx;
  }

  .updateButton {
    bottom: 150rpx !important;
    position: fixed;
    width: 100%;
    z-index: 1024;
    display: flex;
    flex-direction: column;
  }

  .updateButton .cu-btn {
    float: right;
    right: -5rpx;
    border-radius: 150rpx 0 0 150rpx !important;
    padding: 10rpx 10rpx 10rpx 25rpx;
    margin-top: 15rpx;
  }

  .updateButton .cu-btn .text {
    text-indent: 5rpx;
  }

  .tui-modal-custom {
    text-align: center;
  }
</style>
