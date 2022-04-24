<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <view slot="content">{{ UploadNum == 0 ? "添加楼房" : "正在上传..." }}</view>
    </cu-custom>

    <view class="cu-bar bg-white margin-top">
      <view class="action"> 图片上传 </view>
      <view class="action">
        {{ videoList.length }}/1
        <span class="iconfont icon-Videorecordcamera text-blue margin-right-sm margin-left-xs"></span>
        {{ imgList.length }}/9
        <span class="iconfont icon-tupian2 text-blue margin-left-xs"></span>
      </view>
    </view>
    <view class="cu-form-group">
      <view class="grid col-4 grid-square flex-sub">
        <view v-for="(item, index) in videoList" :key="index" class="bg-video" :data-index="index" @tap="ViewVideo">
          <video :src="item.url" object-fit="cover" :controls="false" :muted="true" :autoplay="true" :loop="true"
            class="radius"></video>
          <view class="cu-tag bg-red" @tap.stop="DelVideo" :data-index="index">
            <text class="cuIcon-close"></text>
          </view>
        </view>

        <view v-for="(item, index) in imgList" :key="index" class="bg-img" @tap="ViewImage" :data-url="item">
          <image :src="item" mode="aspectFill"></image>
          <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
            <text class="cuIcon-close"></text>
          </view>
          <view class="bg-white cu-tag margin-0 set-main-img" @tap.stop="setMainImg" :data-index="index">
            {{ index == 0 ? "首页" : "设为首页" }}
          </view>
        </view>

        <view class="solids" @tap="chooseMedia" v-if="imgList.length < 9 || videoList.length < 1">
          <text class="cuIcon-cameraadd"></text>
        </view>
      </view>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋标题</view>
      <input type="text" confirm-type="next" placeholder="输入标题" class="text-right" @input="inputTitle"
        :value="house.title" />
      <span class="iconfont icon-biaotilan text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋户型</view>
      <picker mode="multiSelector" @change="inputHouseType" :value="houseTypeIndex" :range="houseTypeArray">
        <view class="picker">
          {{ houseTypeArray[0][houseTypeIndex[0]]
          }}{{ houseTypeArray[1][houseTypeIndex[1]]
          }}{{ houseTypeArray[2][houseTypeIndex[2]] }}
        </view>
      </picker>
      <span class="iconfont icon-huxing text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">支付类型</view>
      <picker mode="multiSelector" @change="inputPayMethod" :value="payMethodIndex" :range="payMethodArray">
        <view class="picker">
          {{ payMethodArray[0][payMethodIndex[0]]
          }}{{ payMethodArray[1][payMethodIndex[1]] }}
        </view>
      </picker>
      <span class="iconfont icon-zhifufangshi1 text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">地区选择</view>
      <!-- #ifdef MP -->
      <picker @change="inputRegion" mode="region"
        :value="[house.region.province, house.region.city, house.region.area]">
        <view class="picker">
          {{ house.region.province + "-" + house.region.city + "-" + house.region.area }}
        </view>
      </picker>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <picker @change="inputRegion" @columnchange="regionColumnChange" mode="multiSelector" :value="regionIndex"
        :range="regionArr">
        <view class="picker">
          {{house.region.province + "-" + house.region.city + "-" + house.region.area}}
        </view>
      </picker>
      <!-- #endif -->

      <span class="iconfont icon-zhongguoditu text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">详细地址</view>
      <input confirm-type="next" placeholder="房屋详细地址" class="text-right" @input="inputAddress" :value="house.address" />
      <span class="iconfont icon-xiangxidizhi text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋房东</view>
      <input confirm-type="next" placeholder="姓名" class="text-right" @input="inputLandlord" :value="house.landlord" />
      <span class="iconfont icon-fangdong text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房东电话</view>
      <input type="number" confirm-type="next" maxlength="11" placeholder="联系电话" class="text-right" @input="inputPhone"
        :value="house.phone" />
      <span class="iconfont icon-dianhua text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">租用租金</view>
      <input type="number" confirm-type="next" placeholder="元/月" class="text-right" @input="inputRent"
        :value="house.rent" />
      <span class="iconfont icon-fangwuzujin text-blue margin-left-sm"></span>
    </view>
    <view class="cu-form-group">
      <view class="title">房屋楼层</view>
      <input type="text" confirm-type="next" placeholder="如：6/8" class="text-right" @input="inputFloor"
        :value="house.floor.atFloor + '/' + house.floor.totalFloor" />
      <span class="iconfont icon-louceng2 text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋房号</view>
      <input type="text" confirm-type="next" placeholder="如：602" class="text-right" @input="inputHouseNum"
        :value="house.houseNum" />
      <span class="iconfont icon-number text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋面积</view>
      <input type="digit" confirm-type="next" placeholder="如：100" class="text-right" @input="inputArea"
        :value="house.area" />
      <span class="iconfont icon-mianji-xian text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋用途</view>
      <input confirm-type="next" placeholder="如：普通住宅" class="text-right" @input="inputUseWay" :value="house.useWay" />
      <span class="iconfont icon-jiancefangfa text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">临近地段</view>
      <input confirm-type="next" placeholder="使用空格区分" class="text-right" @input="inputDistricts"
        :value="tempDistricts" />
      <span class="iconfont icon-chengshi- text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">附近地铁</view>
      <input confirm-type="next" placeholder="使用空格区分" class="text-right" @input="inputSubways" :value="tempSubways" />
      <span class="iconfont icon-ditie text-blue margin-left-sm"></span>
    </view>

    <view class="cu-form-group">
      <view class="title">房屋标签</view>
      <input confirm-type="done" placeholder="使用空格区分" class="text-right" @input="inputTags" :value="tempTags" />
      <span class="iconfont icon-tags text-blue margin-left-sm"></span>
    </view>

    <view class="padding-xl flex flex-direction">
      <button class="cu-btn bg-blue margin-tb-sm shadow-blur round lg" @tap="handleSubmit">
        提交
      </button>
    </view>
    <view class="padding-xl"></view>

    <view :class="'cu-modal ' + (showReleasedModal? 'show' : '')">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">添加成功</view>
          <view class="action" @tap="closePage">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> 是否添加下一个？ </view>
        <view class="cu-bar bg-white">
          <button class="cu-btn line-grey margin-left" @tap="closePage">取消</button>
          <button class="cu-btn line-blue text-blue" @tap="useCurrentTemp">
            使用当前模板
          </button>
          <button class="cu-btn bg-blue margin-right" @tap="handleConfirm">确定</button>
        </view>
      </view>
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
  import pca from "../../utils/pca.json";
  export default {
    data() {
      return {
        showloading: false,
        loadingText: "加载中...",
        tipsColor: "warning",
        tipsPosition: "top",
        houseTypeIndex: [1, 1, 1],
        payMethodIndex: [2, 1],
        imgList: [],
        videoList: [],
        houseTypeArray: [
          ["0室", "1室", "2室", "3室", "4室", "5室"],
          ["0厅", "1厅", "2厅", "3厅", "4厅", "5厅"],
          ["0卫", "1卫", "2卫", "3卫", "4卫", "5卫"],
        ],
        payMethodArray: [
          ["押零", "押一", "押二", "押三", "押四", "押五"],
          ["付零", "付一", "付二", "付三", "付四", "付五"],
        ],
        regionIndex: [18, 0, 0],
        regionArr: [
          [
            "北京市",
            "天津市",
            "河北省",
            "山西省",
            "内蒙古自治区",
            "辽宁省",
            "吉林省",
            "黑龙江省",
            "上海市",
            "江苏省",
            "浙江省",
            "安徽省",
            "福建省",
            "江西省",
            "山东省",
            "河南省",
            "湖北省",
            "湖南省",
            "广东省",
            "广西壮族自治区",
            "海南省",
            "重庆市",
            "四川省",
            "贵州省",
            "云南省",
            "西藏自治区",
            "陕西省",
            "甘肃省",
            "青海省",
            "宁夏回族自治区",
            "新疆维吾尔自治区",
          ],
          [
            "广州市",
            "韶关市",
            "深圳市",
            "珠海市",
            "汕头市",
            "佛山市",
            "江门市",
            "湛江市",
            "茂名市",
            "肇庆市",
            "惠州市",
            "梅州市",
            "汕尾市",
            "河源市",
            "阳江市",
            "清远市",
            "东莞市",
            "中山市",
            "潮州市",
            "揭阳市",
            "云浮市",
          ],
          [
            "荔湾区",
            "越秀区",
            "海珠区",
            "天河区",
            "白云区",
            "黄埔区",
            "番禺区",
            "花都区",
            "南沙区",
            "从化区",
            "增城区",
          ],
        ],
        index: 0,
        house: {
          direction: "",
          districts: [],
          subways: [],
          tags: [],
          floor: {
            totalFloor: 1,
            atFloor: 1,
          },
          houseType: {
            rooms: 1,
            halls: 1,
            toilets: 1,
          },
          imgUrl: [],
          videoUrl: [],
          rent: 1000,
          region: {
            province: "广东省",
            city: "广州市",
            area: "天河区",
          },
          address: "",
          title: "",
          payMethod: {
            mortgage: 2,
            pay: 1,
          },
          useWay: "普通住宅",
          area: 20,
          landlord: "",
          phone: "",
          houseNum: "",
          isRented: false,
          dueTime: "",
        },
        timeId: -1,
        UploadNum: 0,
        showReleasedModal: false,
        tempDistricts: "",
        tempSubways: "",
        tempTags: "",
      };
    },

    async onLoad(options) {
      this.userInfo = uni.getStorageSync("userInfo");
      this.checkHouseTemplate();
      this.pca = pca;
      // 获取临时签名 用于上传阿里云对象存储OSS
      this.getOssToken();
    },

    methods: {
      checkHouseTemplate() {
        var houseTemplate = uni.getStorageSync("houseTemplate"); // 模板复制30分钟内有效
        console.log(houseTemplate);
        if (
          new Date().getTime() - houseTemplate.time <= 30 * 60 * 1000 &&
          !houseTemplate.coyied
        ) {
          houseTemplate.coyied = true;
          uni.setStorageSync("houseTemplate", houseTemplate);
          let that = this;
          uni.showModal({
            title: "复制模板",
            content: "检测到房源模板要粘贴吗？",
            success: function(res) {
              if (res.confirm) {
                if (res.confirm) {
                  console.log(houseTemplate);
                  var tempHouse = houseTemplate.template;
                  var tempTags = "";
                  var tempSubways = "";
                  var tempDistricts = "";
                  tempHouse.tags.forEach((item) => {
                    tempTags += item + " ";
                  });
                  tempHouse.subways.forEach((item) => {
                    tempSubways += item + " ";
                  });
                  tempHouse.districts.forEach((item) => {
                    tempDistricts += item + " ";
                  });

                  that.houseTypeIndex = [
                    tempHouse.houseType.rooms,
                    tempHouse.houseType.halls,
                    tempHouse.houseType.toilets,
                  ];

                  that.payMethodIndex = [
                    tempHouse.payMethod.mortgage,
                    tempHouse.payMethod.pay,
                  ];
                  tempHouse.imgUrl = [];
                  tempHouse.videoUrl = [];
                  that.house = {
                    ...tempHouse
                  };
                  console.log(that.house);

                  // this.region = tempHouse.region;
                  that.tempTags = tempTags;
                  that.tempSubways = tempSubways;
                  that.tempDistricts = tempDistricts;

                  var template = uni.getStorageSync("houseTemplate");
                  // template.coyied = true;
                  uni.setStorageSync("houseTemplate", template);
                }
              }
            },
          });
        }
      },

      // 获取oss签名
      getOssToken() {
        let ossHouseSignature = uni.getStorageSync("ossHouseSignature");
        let expire = new Date(ossHouseSignature.expire * 1000).getTime();
        let now = new Date().getTime();
        console.log(expire);
        console.log(now);
        if (ossHouseSignature == "" || expire <= now) {
          // if (true) {
          this.http.get("/oss/osstoken?dir=house", {}).then((res) => {
            console.log(res);
            if (res.code != 200) {
              this.showTips(res.msg, "warning");
            } else {
              this.ossHouseSignature = res.data;
              uni.setStorageSync("ossHouseSignature", res.data);
            }
            return res.data;
          });
        } else {
          this.ossHouseSignature = ossHouseSignature;
        }
      },
      // 选择媒体文件
      async chooseMedia() {
        var fullImg = this.imgList.length < 9;
        var fullVideo = this.videoList.length < 1;
        console.log(false || fullVideo);
        console.log(false && fullVideo);

        if (fullImg || fullVideo) {
          if (fullImg && fullVideo) {
            uni.showActionSheet({
              itemList: ["上传照片", "上传视频"],
              success: (res) => {
                console.log(res);
                let chooseIndex = res.tapIndex;
                if (chooseIndex == 0) {
                  this.chooseImage();
                } else if (chooseIndex == 1) {
                  this.chooseVideo();
                } else if (chooseIndex == -1) {
                  // 提示出错
                  uni.showToast({
                    title: "出现错误"
                  });
                }
              },
              fail: (fail) => {
                console.log(fail);
                // uni.showToast({ title: "出现错误" });
              },
            });
          } else if (fullImg) {
            uni.showActionSheet({
              itemList: ["上传照片"],
              success: (res) => {
                console.log(res);
                let chooseIndex = res.tapIndex;

                if (chooseIndex == 0) {
                  this.chooseImage();
                } else if (chooseIndex == -1) {
                  // 提示出错
                  uni.showToast({
                    title: "出现错误"
                  });
                }
              },
              fail: (fail) => {
                console.log(fail);
                // uni.showToast({ title: "出现错误" });
              },
            });
          } else if (fullVideo) {
            uni.showActionSheet({
              itemList: ["上传视频"],
              success: (res) => {
                console.log(res);
                let chooseIndex = res.tapIndex;
                if (chooseIndex == 0) {
                  this.chooseVideo();
                } else if (chooseIndex == -1) {
                  // 提示出错
                  uni.showToast({
                    title: "出现错误"
                  });
                }
              },
              fail: (fail) => {
                console.log(fail);
                uni.showToast({
                  title: "出现错误"
                });
              },
            });
          }
        }
      },

      // 选择图片
      async chooseImage() {
        uni.chooseImage({
          count: 9,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            console.log("选择图片");
            console.log(res);
            this.uploadImg(res.tempFilePaths, res.tempFiles); //  this.uploadFileTest(res.tempFilePaths)

            if (this.imgList.length != 0) {
              this.imgList = this.imgList.concat(res.tempFilePaths);
            } else {
              this.imgList = res.tempFilePaths;
            }
          },
        });
      },

      // 预览图片
      ViewImage(e) {
        uni.previewImage({
          urls: this.imgList,
          current: e.currentTarget.dataset.url,
        });
      },

      // 删除图片
      DelImg(e) {
        var index = e.currentTarget.dataset.index;
        uni.showModal({
          content: "确定要删除这张图片吗？",
          cancelText: "取消",
          confirmText: "删除",
          success: (res) => {
            if (res.confirm) {
              let imgUrl = this.house.imgUrl;
              imgUrl.splice(index, 1);
              this.imgList = imgUrl;
              this.house.imgUrl = imgUrl;
            }
          },
        });
      },

      // 选择视频
      async chooseVideo() {
        uni.chooseVideo({
          count: 1,
          sourceType: ["album", "camera"],
          compressed: true,
          success: (res) => {
            console.log(res);

            /* #ifdef H5 */
            this.uploadVideo(res.tempFilePath, res.tempFile);
            /* #endif */

            /* #ifdef MP */
            this.uploadVideo(res.tempFilePath, res.tempFilePath);
            /* #endif */

            if (this.videoList.length != 0) {
              this.videoList.push({
                type: "video",
                url: res.tempFilePath,
                poster: res.thumbTempFilePath,
              });
            } else {
              this.videoList = [{
                type: "video",
                url: res.tempFilePath,
                poster: res.thumbTempFilePath,
              }, ];
            }
          },
        });
      },

      // 预览视频
      ViewVideo(e) {
        uni.previewMedia({
          sources: this.videoList,
          current: e.currentTarget.dataset.index,
        });
      },

      // 删除视频
      DelVideo(e) {
        var index = e.currentTarget.dataset.index;
        uni.showModal({
          content: "确定要删除这个视频吗？",
          cancelText: "取消",
          confirmText: "删除",
          success: (res) => {
            if (res.confirm) {
              this.videoList.splice(index, 1);
              this.house.videoUrl.splice(index, 1);

              this.videoList = this.videoList;
              this.house.videoUrl = this.house.videoUrl;
            }
          },
        });
      },

      inputTitle(e) {
        this.house.title = e.detail.value.trim();

        // this.timeId = setTimeout(() => {
        // }, 500);
      },

      inputHouseType(e) {
        console.log(e);
        this.house.houseType = {};
        var {
          houseType
        } = this.house;
        var {
          value
        } = e.detail;
        houseType.rooms = value[0];
        houseType.halls = value[1];
        houseType.toilets = value[2];
        this.houseTypeIndex = e.detail.value;
      },

      inputPayMethod(e) {
        var mortgage = e.detail.value[0];
        var pay = e.detail.value[1];
        var payMethodArray = this.payMethodArray;

        if (mortgage == payMethodArray[0].length) {
          mortgage = 0;
        }

        if (pay == payMethodArray[1].length) {
          mortgage = 0;
        }

        this.house.payMethod.mortgage = mortgage;
        this.house.payMethod.pay = pay;
        this.payMethodIndex = e.detail.value;
      },

      inputRegion(e) {
        console.log(e);
        // 适配微信小程序的地址选择器
        /* #ifdef MP */
        let region = e.detail.value;
        this.house.region = {
          province: region[0],
          city: region[1],
          area: region[2],
        };
        /* #endif */

        /* #ifdef H5 */
        this.regionIndex = e.detail.value;
        let {
          regionArr,
          regionIndex
        } = this;
        this.house.region = {
          province: regionArr[0][regionIndex[0]],
          city: regionArr[1][regionIndex[1]],
          area: regionArr[2][regionIndex[2]],
        };
        /* #endif */
      },
      regionColumnChange(e) {
        console.log(e);
        let {
          column,
          value
        } = e.detail;
        let regionArr = this.regionArr;
        let regionIndex = this.regionIndex;
        if (column == 0) {
          this.regionIndex[0] = value;
          // 获取变化后的省
          let currentProv = regionArr[0][value];
          // 通过getOwnPropertyNames获取城市列表
          let city = Object.getOwnPropertyNames(pca[currentProv]);
          // 当前市 改变省后的默认市是第一个
          let currentArea = city[0];
          // 当前市当前区列表 这时候可通过pca Json来读取，因为json里到此存的是数组
          let area = pca[currentProv][currentArea];
          this.regionArr[1] = city;
          this.regionArr[2] = area;
        } else if (column == 1) {
          this.regionIndex[1] = value;
          let currentProv = regionArr[0][regionIndex[0]];
          let currentArea = regionArr[1][value];
          let area = pca[currentProv][currentArea];
          this.regionArr[2] = area;
        } else if (column == 2) {
          this.regionIndex[2] = value;
        }
      },

      inputAddress(e) {
        this.house.address = e.detail.value.trim();
      },

      inputLandlord(e) {
        this.house.landlord = e.detail.value.trim();
      },

      inputPhone(e) {
        this.house.phone = e.detail.value.trim();
      },

      inputRent(e) {
        var rent = Number(e.detail.value);

        if (!isNaN(rent)) {
          this.house.rent = rent;
        } else {
          uni.showToast({
            title: "输入有误",
            icon: "none",
            duration: 1000,
          });
        }
      },

      inputFloor(e) {
        let floor = e.detail.value.trim().split("/");

        if (
          floor.length > 1 &&
          !isNaN(parseInt(floor[0])) &&
          !isNaN(parseInt(floor[1]))
        ) {
          this.house.floor.atFloor = parseInt(floor[0]);
          this.house.floor.totalFloor = parseInt(floor[1]);
          console.log(this.house.floor);
        } else {
          uni.showToast({
            title: "输入有误",
            icon: "none",
            duration: 1000,
          });
        }

        console.log(this.house.floor);
      },

      inputHouseNum(e) {
        this.house.houseNum = e.detail.value.trim();
        console.log(this.house.houseNum);
      },

      inputArea(e) {
        var area = Number(e.detail.value);

        if (!isNaN(area)) {
          this.house.area = area;
        } else {
          uni.showToast({
            title: "输入有误",
            icon: "none",
            duration: 1000,
          });
        }

        console.log(this.house.area);
      },

      inputUseWay(e) {
        this.house.useWay = e.detail.value.trim();
      },

      inputDistricts(e) {
        let districtsOld = e.detail.value.trim().split(" ");
        let districts = [];
        districtsOld.forEach((item, index) => {
          if (item != "") {
            districts.push(item);
          }
        });
        this.house.districts = districts;
      },

      inputSubways(e) {
        let subwaysOld = e.detail.value.trim().split(" ");
        let subways = [];
        subwaysOld.forEach((item, index) => {
          if (item != "") {
            subways.push(item);
          }
        });
        this.house.subways = subways;
      },

      inputTags(e) {
        let tagsOld = e.detail.value.trim().split(" ");
        var tags = [];
        tagsOld.forEach((item, index) => {
          if (item != "") {
            tags.push(item);
          }
        });
        this.house.tags = tags;
      },

      uploadImg(tempFilePaths, tempfiles) {
        this.UploadNum = this.UploadNum + tempFilePaths.length;
        let uuidlast = this.userInfo.uuid.substring(24, 36);
        for (let i = 0; i < tempFilePaths.length; i++) {
          /* #ifdef H5 */
          let pathArr = tempfiles[i].name.split(".");
          /* #endif */

          /* #ifdef MP */
          let pathArr = tempfiles[i].path.split(".");
          /* #endif */

          let fileName =
            Date.now() + "-" + uuidlast + "." + pathArr[pathArr.length - 1];
          let filePath = "house/image/";
          let fileKey = filePath + fileName;
          uni.uploadFile({
            url: this.ossHouseSignature.host,
            filePath: tempFilePaths[i],
            fileType: "image",
            name: "file",
            formData: {
              key: fileKey,
              policy: this.ossHouseSignature.policy,
              OSSAccessKeyId: this.ossHouseSignature.accessid,
              success_action_status: "200", // 让服务端返回200,不然，默认会返回204
              signature: this.ossHouseSignature.signature,
            },
            success: (res) => {
              console.log(res);
              if (res.statusCode == "200") {
                console.log(res);
                this.house.imgUrl.push(
                  this.ossHouseSignature.host + "/" + fileKey
                );
                this.UploadNum = this.UploadNum - 1;
              } else {
                console.log(res.data);
              }
            },
            fail: (err) => {
              console.log(err);
              uni.showToast({
                title: "网络似乎出现问题",
                icon: "none",
                mask: true,
                duration: 2000,
              });
            },
          });
        }
      },

      async uploadVideo(tempFilePath, tempfile) {
        this.UploadNum = this.UploadNum + 1;
        let uuidlast = this.userInfo.uuid.substring(24, 36);

        /* #ifdef H5 */
        let pathArr = tempfile.name.split(".");
        /* #endif */

        /* #ifdef MP */
        let pathArr = tempfile.split(".");
        /* #endif */

        let fileName =
          Date.now() + "-" + uuidlast + "." + pathArr[pathArr.length - 1];
        let filePath = "house/video/";
        let fileKey = filePath + fileName;
        uni.uploadFile({
          url: this.ossHouseSignature.host,
          filePath: tempFilePath,
          fileType: "video",
          name: "file",
          formData: {
            key: fileKey,
            policy: this.ossHouseSignature.policy,
            OSSAccessKeyId: this.ossHouseSignature.accessid,
            success_action_status: "200", // 让服务端返回200,不然，默认会返回204
            signature: this.ossHouseSignature.signature,
          },
          success: (res) => {
            console.log(res);
            if (res.statusCode == "200") {
              console.log(res);
              this.house.videoUrl.push({
                type: "video",
                url: this.ossHouseSignature.host + "/" + fileKey,
                poster: "",
              });
              this.UploadNum = this.UploadNum - 1;
            } else {
              console.log(res.data);
            }
          },
          fail: (err) => {
            console.log(err);
            uni.showToast({
              title: "网络似乎出现问题",
              icon: "none",
              mask: true,
              duration: 2000,
            });
          },
        });
      },

      async handleSubmit() {
        const {
          house
        } = this;
        const {
          houseTypeIndex
        } = this;
        const {
          payMethodIndex
        } = this;
        house.houseType.rooms = houseTypeIndex[0];
        house.houseType.halls = houseTypeIndex[1];
        house.houseType.toilets = houseTypeIndex[2];
        house.payMethod.mortgage = payMethodIndex[0];
        house.payMethod.pay = payMethodIndex[1];
        if (this.UploadNum > 0) {
          uni.showToast({
            title: "图片上传中...",
            duration: 1000,
            icon: "none",
          });
        } else {
          if (house.title == "") {
            this.showToast("似乎标题未填写");
          } else if (house.address == "") {
            this.showToast("似乎详细地址未填写");
          } else if (house.landlord == "") {
            this.showToast("似乎房东姓名未填写");
          } else if (house.phone == "") {
            this.showToast("似乎房东电话未填写");
          } else if (house.rent == "") {
            this.showToast("似乎租金未填写");
          } else if (house.floor.mortgage == 0) {
            this.showToast("似乎楼层未填写");
          } else if (house.area == "") {
            this.showToast("似乎面积未填写");
          } else if (house.useWay == "") {
            this.showToast("似乎房屋用途未填写");
          } else if (house.houseNumber == 0) {
            this.showToast("似乎房屋房号未填写");
          } else {
            this.loadingCpt(true, "稍等...");
            console.log(house);

            await this.http
              .post("/house/release", {
                data: {
                  ...this.house,
                },
              })
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  // this.showTips(res.msg, "success");
                  this.showReleasedModal = true;
                } else {
                  this.showTips(res.msg, "warning");
                }
                return res.data;
              });
            this.loadingCpt(false);
          }
        }
      },

      showToast(title) {
        uni.showToast({
          title: title,
          icon: "none",
          duration: 800,
          mask: false,
        });
      },

      closePage() {
        console.log("关闭页面");
        this.showReleasedModal = false;
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          });
        }, 150);
      },

      useCurrentTemp() {
        this.showReleasedModal = false;
      },

      handleConfirm() {
        uni.redirectTo({
          url: "../release/index",
        });
      },

      setMainImg(e) {
        let index = e.currentTarget.dataset.index;
        console.log(index);
        if (index > 0) {
          let img = this.imgList.splice(index, 1);
          this.imgList.splice(0, 0, img[0]);
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
  .set-main-img {
    width: 100%;
    height: 50rpx;
    top: 100% !important;
    transform: translateY(-100%);
    background-color: rgba(0, 0, 0, 0.4) !important;
    position: absolute;
    font-size: 24rpx;
    font-weight: 400;
    padding: 3rpx 6rpx !important;
    color: var(--ghostWhite);
    text-shadow: 2rpx 2rpx 6rpx rgba(255, 255, 255, 1);
    border-radius: 5rpx 5rpx 0 0;
  }
</style>
