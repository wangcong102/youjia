<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="false">
      <view slot="content">勘察</view>
    </cu-custom>
    <view class="container">
      <!--header-->
      <view class="tui-header-box" :style="'top:' + height + 'px;background-color:var(--blue)!important'">
        <tui-searchbar radius="20px" placeholder="搜索" backgroundColor="#0081ff" cancelColor="#fff" searchColor="#fff"
          @search="search" @input="inputKeyWord" :value="keyword"></tui-searchbar>
      </view>
      <!--header-->
      <!--screen-->
      <view class="tui-header-screen" :style="'top:' + (height + 52) + 'px'">
        <scroll-view scroll-x class="bg-white nav">
          <view class="flex text-center">
            <view v-for="(item, index) in attrArr" :key="index"
              :class="'cu-item flex-sub ' + (index == TabIndex ? 'text-blue cur' : '')" @tap="tabSelect"
              :data-index="index">
              {{ item.name }}
            </view>
          </view>
        </scroll-view>
      </view>
      <!--screen-->
      <!--list-->
      <block v-if="!ShowNodata">
        <view class="tui-product-list" :style="'margin-top:' + (height + 52) + 'px'">
          <view class="tui-product-container">
            <block v-for="(item, index) in houseList" :key="index">
              <!--商品列表-->
              <view class="tui-pro-item tui-flex-list">
                <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.houseId+'&house='+encodeURIComponent(JSON.stringify(item))" open-type="navigate"
                  hover-class="none">
                  <img :src="
                      item.imgUrl[0]
                        ? item.imgUrl[0]
                        : 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png'
                    " class="tui-proimg-list tui-pro-img-list bg-gray" mode="aspectFill" />
                </navigator>

                <view class="tui-pro-content" @tap="navToHouseDetail">
                  <view class="'text-darkGray tui-pro-tit">
                    <text v-if="item.atTop" class="cuIcon-appreciatefill text-themeColor"></text>
                    {{ item.title }}
                  </view>
                  <view>
                    <view class="padding-top-xs">
                      <block v-if="item.houseType.rooms==1&&item.houseType.halls==0">
                        <text class="text-grey tui-pro-subtit">
                          {{ item.houseNum }}室 • 单间 • {{ item.area }}m²•楼{{
                            item.floor.atFloor
                          }}/{{ item.floor.totalFloor }}
                        </text>
                      </block>
                      <block v-else="">
                        <text class="text-grey tui-pro-subtit">
                          {{ item.houseNum }}室 • {{ item.houseType.rooms }}房{{
                            item.houseType.halls
                          }}厅{{ item.houseType.toilets }}卫•{{ item.area }}m²•楼{{
                            item.floor.atFloor
                          }}/{{ item.floor.totalFloor }}
                        </text>
                      </block>
                    </view>
                    <view class="tui-pro-price flex justify-between">
                      <view>
                        <text class="tui-sale-price-list text-cut">{{ item.rent }}</text>
                        <text class="tui-price-measure">元/月</text>
                      </view>
                      <view style="position: relative">
                        <view v-if="TabIndex == 0">
                          <span class="iconfont icon-qiang1 text-blue" :data-index="index"
                            style="font-size: 38rpx; text-shadow: 1px 1px 2px #0081ff66"></span>
                          <tui-cubic-bezier :windowWidth="windowWidth" :windowHeight="windowHeight"
                            backgroundColor="#0081ff" width="40rpx" height="40rpx" :position="{
                              top: height * 4,
                              left: windowWidth * 0.5,
                            }" direction="top" :index="index" @click="rushSurvey" :params="item.houseId">
                            <span class="iconfont icon-qiang1"></span>
                          </tui-cubic-bezier>
                        </view>

                        <view v-else-if="TabIndex == 1">
                          <span class="icon-tuidan text-blue iconfont" :data-index="index"
                            style="font-size: 38rpx; text-shadow: 1px 1px 2px #0081ff"></span>
                          <tui-cubic-bezier :windowWidth="windowWidth" :windowHeight="windowHeight"
                            backgroundColor="#0081ff" width="40rpx" height="40rpx" :position="{
                              top: height * 4,
                              left: windowWidth * 0.5,
                            }" direction="top" :index="index" @click="cancelSurvey" :params="item.houseId">
                            <span class="iconfont icon-tuidan"></span>
                          </tui-cubic-bezier>
                        </view>
                        <view v-else-if="TabIndex == 2"> </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <!--商品列表-->
            </block>
          </view>
        </view>
      </block>

      <block v-else="">
        <view class="nodata" :style="'margin-top:' + (dropScreenH + 18) + 'rpx'">
          <img class="nodataImg" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
        </view>
      </block>
      <!--list-->

      <!--加载loading-->
      <tui-loadmore v-if="loading && TabIndex == 1" :index="3" type="primary"></tui-loadmore>
      <tui-nomore v-if="!pullUpOn" backgroundColor="#f7f7f7"></tui-nomore>
      <!--加载loading-->

      <!-- 回到顶部 -->
      <tui-scroll-top :scrollTop="0"></tui-scroll-top>
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
        keyword: "",
        //搜索关键词
        width: 200,
        //header宽度
        height: 64,
        //header高度
        arrowTop: 0,
        //箭头距离顶部距离
        dropScreenH: 0,
        //下拉筛选框距顶部距离
        attrData: [],
        attrIndex: -1,
        dropScreenShow: false,
        scrollTop: 0,
        drawer: false,
        //筛选侧栏开关
        drawerH: 0,
        //抽屉内部scrollview高度
        selectedName: "排序",
        attrArr: [{
            name: "全部",
            selectedName: "全部",
            isActive: false,
            list: [],
          },
          {
            name: "待勘察",
            selectedName: "待勘察",
            isActive: false,
            list: [],
          },
          {
            name: "已完成",
            selectedName: "已完成",
            isActive: false,
            list: [],
          },
        ],
        houseList: [],
        filterWords: {
          subways: [{
              filterWord: "天河客运站",
              count: 3431,
              selected: false,
            },
            {
              filterWord: "长湴",
              count: 1182,
              selected: false,
            },
            {
              filterWord: "燕塘",
              count: 106,
              selected: false,
            },
          ],
          districts: [{
              filterWord: "下元岗",
              count: 1904,
              selected: false,
            },
            {
              filterWord: "上元岗",
              count: 1392,
              selected: false,
            },
            {
              filterWord: "长湴东街",
              count: 253,
              selected: false,
            },
          ],
          tags: [{
              filterWord: "阳台",
              count: 2025,
              selected: false,
            },
            {
              filterWord: "光线充足",
              count: 1532,
              selected: false,
            },
            {
              filterWord: "路边",
              count: 1426,
              selected: false,
            },
          ],
          region: ["广东省", "广州市", "天河区"],
          rent: [{
              filterWord: "0 - 1000",
              selected: false,
            },
            {
              filterWord: "1500 - 2000",
              selected: false,
            },
            {
              filterWord: "2000 - 2500",
              selected: false,
            },
            {
              filterWord: "2500 - 3000",
              selected: false,
            },
            {
              filterWord: "3000 - 3500",
              selected: false,
            },
            {
              filterWord: "3500 - 4000",
              selected: false,
            },
          ],
          floor: [{
              filterWord: "0 - 5",
              selected: false,
            },
            {
              filterWord: "5 - 10",
              selected: false,
            },
            {
              filterWord: "10 - 15",
              selected: false,
            },
          ],
          area: [{
              filterWord: "0 - 25",
              selected: false,
            },
            {
              filterWord: "25 - 50",
              selected: false,
            },
            {
              filterWord: "50 - 100",
              selected: false,
            },
          ],
          isRented: [{
              filterWord: "未租",
              selected: true,
            },
            {
              filterWord: "已租",
              selected: false,
            },
          ],
          landlords: [{
              filterWord: "谭敏健",
              count: 313,
              selected: false,
            },
            {
              filterWord: "廖顺海",
              count: 173,
              selected: false,
            },
            {
              filterWord: "梁荣杰",
              count: 173,
              selected: false,
            },
          ],
        },
        page: 0,
        value: "",
        TabIndex: 0,
        scrollLeft: (0 - 1) * 60,
        operate: "all",
        inputTop: "",
        ShowNodata: "",
        reqUrl: "/house/survey/list",
        reqList: {
          all: [],
          rushed: [],
          completed: [],
        },
        s_filter:{
           isRented: [false],
        },
        loading: true,
        pullUpOn: true,
      };
    },
    async onLoad(options) {
      this.init(options);
      // this.getFilterWords();
      this.getSearchLists(this.page);
    },

    onShow() {
      var filter = uni.getStorageSync("filter");
      if (!filter) {
        this.getFilterWords();
      }
    },

    //滑动到底加载
    onReachBottom() {
      this.page += 1;
      // 已抢页 最多五条数据不需触底加载
      if (this.TabIndex != 1) {
        this.getSearchLists(this.page);
      }
    },

    //下拉刷新
    async onPullDownRefresh() {
      this.loadingCpt(true);
      this.page = 0;
      this.houseList = [];
      await this.getSearchLists(this.page);
      this.loadingCpt(false);
      uni.stopPullDownRefresh();
    },

    methods: {
      init(options) {
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
              obj.top + obj.height - 4 :
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
        // 贝塞尔曲线动画宽高
        setTimeout(() => {
          let sys = uni.getSystemInfoSync();
          this.windowWidth = sys.windowWidth;
          this.windowHeight = sys.windowHeight;
        }, 50);
      },
      // 抢占勘察
      rushSurvey(e) {
        let index = e.index;
        let houseId = e.params;
        console.log(index, houseId);
        // this.houseList.splice(index, 1);
        this.http
          .post("/house/survey/rush", {
            data: {
              operate: 1,
              houseId: houseId,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.code == 200) {
              this.houseList.splice(index, 1);
              // 清空抢占rushed 点击全部加载新数据
              this.reqList.rushed = [];
              this.reqList.completed = [];
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            }
            return res.data;
          });
      },
      // 取消勘察
      cancelSurvey(e) {
        let index = e.index;
        let houseId = e.params;
        console.log(index, houseId);
        // this.houseList.splice(index, 1);
        this.http
          .post("/house/survey/rush", {
            data: {
              operate: 2,
              houseId: houseId,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.code == 200) {
              this.houseList.splice(index, 1);
              // 清空抢占all 点击全部时候加载新数据
              //  this.reqList.all = []
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none",
              });
            }
            return res.data;
          });
      },

      //获取筛选词
      async getFilterWords() {
        await this.http
          .get("/house/filterwords", {})
          .then((res) => {
            let filterWords = res.data;
            this.filterWords.subways = filterWords.subways;
            this.filterWords.districts = filterWords.districts;
            this.filterWords.tags = filterWords.tags;
            this.filterWords.landlords = filterWords.landlords;
            this.attrArr[0].list = filterWords.subways;
            // 放入缓存重置使用
            uni.setStorageSync("s_filter", this.s_filter);
            uni.setStorageSync("attrArr", this.attrArr);
            uni.setStorageSync("house_filter", this.house_filter);
            uni.setStorageSync("filterWords", this.filterWords);
          })
          .catch((err) => {
            console.log(err)
            uni.showToast({
              title: "筛选词获取失败",
              icon: "none",
              mask: true,
            });
          });
      },

      //搜索框输入
      inputKeyWord(e) {
        this.page = 0;
        this.keyword = e.value;
        console.log(e);
        console.log(this.keyword);
      },

      //搜索框开始搜索
      search() {
        this.goTop();
        this.page = 0;
        this.houseList = [];
        this.getSearchLists(this.page);
      },

      //搜索
      async getSearchLists(page) {
        this.loadingCpt(true);
        this.loading = true;

        let reqUrl = this.reqUrl;
        let houseList = await this.http
          .post(reqUrl, {
            data: {
              page: this.page,
              pageSize: this.pageSize,
              keyword: this.keyword,
              sortby: ["at_create"],
              s_filter: this.s_filter,
              order: "desc",
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 403) {
              this.showTips(res.msg, "warning");
            }
            return res.data.item;
          });
        this.loadingCpt(false);
        this.loading = false;
        this.houseList = this.houseList.concat(houseList);

        this.ShowNodata = houseList == "" && this.houseList == "" ? true : false;
      },

      //重置筛选
      reset() {
        this.attrData.forEach((item) => {
          item.selected = false;
        });
        this.s_filter = uni.getStorageSync("s_filter");
        this.attrArr = uni.getStorageSync("attrArr");
        this.filterWords = uni.getStorageSync("filterWords");
        this.house_filter = uni.getStorageSync("house_filter");
      },

      // 清除下拉栏租金选择
      resetRent(e) {
        this.attrData.forEach((item) => {
          item.selected = false;
        });
      },

      // 下滑栏关闭
      btnCloseDrop() {
        this.scrollTop = 1;
        this.$nextTick(() => {
          this.scrollTop = 0;
        });
        this.dropScreenShow = false;
        this.attrIndex = -1;
      },

      //筛选栏
      screen(e) {
        let index = e.currentTarget.dataset.index;
        this.btnCloseDrop();
        if (index == 0) {
          this.showDropdownList();
        } else if (index == 1) {
          // this.isList = !this.isList;
        } else if (index == 2) {
          this.drawer = true;
        }
      },

      //侧边筛选关闭
      closeDrawer: function() {
        this.drawer = false;
      },

      //筛选确定
      drawerSure() {
        this.page = 0;
        this.houseList = [];
        this.goTop();
        this.getSearchLists(this.page);
        this.drawer = false;
        this.dropScreenShow = false;
      },

      //返回顶部
      goTop(e) {
        uni.pageScrollTo({
          scrollTop: 0,
        });
      },

      //格式化日期YY-MM-DD（）
      formatDate(date) {
        var date = date || new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        var nowData = year + "-" + month + "-" + day;
        return nowData;
      },

      //输入租金区间筛选租金
      inputRentSection(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let value = e.detail.value.trim();
        if (index == 0) {
          if (value == "") {
            delete this.house_filter.rent.gte;
            delete this.s_filter.rent.gte;
            console.log("空输入");
          } else {
            console.log("非空输入");
            this.house_filter.rent.gte = parseFloat(value);
            this.s_filter.rent.gte = this.house_filter.rent.gte;
          }
        } else if (index == 1) {
          if (value == "") {
            delete this.house_filter.rent.lte;
            delete this.s_filter.rent.lte;
          } else {
            this.house_filter.rent.lte = parseFloat(value);
            this.s_filter.rent.lte = this.house_filter.rent.lte;
          }
        }
      },

      //清除租金输入
      emptyRent() {
        this.house_filter.rent = {
          gte: "",
          lte: "",
        };
        delete this.s_filter.rent;
        this.resetRent();
        console.log(this.s_filter.rent);
      },

      //筛选地铁
      filterSubways(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let {
          subways
        } = this.house_filter;
        let isSelected = this.filterWords.subways[index].selected;
        let filterWord = this.filterWords.subways[index].filterWord;
        this.filterWords.subways[index].selected = !isSelected;

        if (isSelected) {
          let i = subways.indexOf(filterWord);
          subways.splice(i, 1);
        } else {
          subways.push(filterWord);
        }
        this.s_filter.subways = subways;
        this.s_filter.subways.length == 0 ? delete this.s_filter.subways : "";
      },

      //筛选地段
      filterDistricts(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let {
          districts
        } = this.house_filter;
        let isSelected = this.filterWords.districts[index].selected;
        let filterWord = this.filterWords.districts[index].filterWord;
        this.filterWords.districts[index].selected = !isSelected;

        if (isSelected) {
          let i = districts.indexOf(filterWord);
          districts.splice(i, 1);
        } else {
          districts.push(filterWord);
        }
        this.s_filter.districts = districts;
        this.s_filter.districts.length == 0 ? delete this.s_filter.districts : "";
      },

      //筛选标签
      filterTags(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let {
          tags
        } = this.house_filter;
        let isSelected = this.filterWords.tags[index].selected;
        let filterWord = this.filterWords.tags[index].filterWord;
        this.filterWords.tags[index].selected = !isSelected;

        if (isSelected) {
          let i = tags.indexOf(filterWord);
          tags.splice(i, 1);
        } else {
          tags.push(filterWord);
        }
        this.s_filter.tags = tags;
        this.s_filter.tags.length == 0 ? delete this.s_filter.tags : "";
      },

      //筛选房东
      filterLandlords(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let isSelected = this.filterWords.landlords[index].selected;
        let filterWord = this.filterWords.landlords[index].filterWord;
        this.filterWords.landlords.forEach((item) => {
          item.selected = false;
        });
        this.filterWords.landlords[index].selected = !isSelected;

        if (isSelected) {
          this.house_filter.landlord = "";
        } else {
          this.house_filter.landlord = filterWord;
        }
        this.s_filter.landlord = this.house_filter.landlord;
        this.s_filter.landlord.length == 0 ? delete this.s_filter.landlord : "";
        console.log(this.house_filter.landlord);
      },

      //筛选租用状态
      filterIsRented(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let {
          isRented
        } = this.house_filter;
        let isSelected = this.filterWords.isRented[index].selected;
        let filterWord = this.filterWords.isRented[index].filterWord == "已租";
        this.filterWords.isRented[index].selected = !isSelected;

        if (isSelected) {
          let i = isRented.indexOf(filterWord);
          isRented.splice(i, 1);
        } else {
          isRented.push(filterWord);
        }
        this.s_filter.isRented = this.house_filter.isRented;
        this.s_filter.isRented.length == 0 ? delete this.s_filter.isRented : "";
        console.log(this.house_filter.isRented);
      },

      // 全选isRented
      selectAllIsRented() {
        var isRentedFilter = this.filterWords.isRented;
        if (
          isRentedFilter[0].selected == true &&
          isRentedFilter[1].selected == true
        ) {
          isRentedFilter.forEach((item) => {
            item.selected = false;
          });
          this.house_filter.isRented = [];
        } else {
          isRentedFilter.forEach((item) => {
            item.selected = true;
          });
          this.house_filter.isRented = [true, false];
        }
        this.s_filter.isRented = this.house_filter.isRented;
        this.s_filter.isRented.length == 0 ? delete this.s_filter.isRented : "";
        console.log(this.s_filter.isRented);
      },

      //筛选楼层
      filterFloor(e) {
        // this.filter.condition.floor.atFloor.gte = 0;
        let {
          index
        } = e.currentTarget.dataset;
        let {
          filterWord
        } = this.filterWords.floor[index];
        let isSelected = this.filterWords.floor[index].selected;
        this.filterWords.floor.forEach((item) => {
          item.selected = false;
        });
        this.filterWords.floor[index].selected = !isSelected;
        filterWord = filterWord.split("-");
        filterWord[0] = parseInt(filterWord[0].trim());
        filterWord[1] = parseInt(filterWord[1].trim());
        // console.log(filterWord);
        if (isSelected) {
          this.house_filter.floor = {
            atFloor: {},
          };
        } else {
          this.house_filter.floor = {
            atFloor: {
              gte: filterWord[0],
              lte: filterWord[1],
            },
          };
        }
        this.s_filter.floor = this.house_filter.floor;
        this.s_filter.floor.atFloor.gte == null &&
          this.s_filter.floor.atFloor.gte == null ?
          delete this.s_filter.floor :
          "";
      },

      //输入楼层
      inputFloor(e) {
        this.filterWords.floor.forEach((item) => {
          item.selected = false;
        });
        this.house_filter.floor = {
          atFloor: {
            gte: e.value,
            lte: e.value,
          },
        };
        this.s_filter.floor = this.house_filter.floor;
        console.log(e.value);
      },

      //筛选面积
      filterArea(e) {
        let {
          index
        } = e.currentTarget.dataset;
        let filterWord = this.filterWords.area[index].filterWord;
        let isSelected = this.filterWords.area[index].selected;

        this.filterWords.area.forEach((item) => {
          item.selected = false;
        });
        this.filterWords.area[index].selected = !isSelected;

        filterWord = filterWord.split("-");
        filterWord[0] = parseInt(filterWord[0].trim());
        filterWord[1] = parseInt(filterWord[1].trim());
        if (isSelected) {
          this.house_filter.area = {};
        } else {
          this.house_filter.area = {
            gte: filterWord[0],
            lte: filterWord[1],
          };
        }
        this.s_filter.area = this.house_filter.area;
        this.s_filter.area.gte == null && this.s_filter.area.gte == null ?
          delete this.s_filter.area :
          "";
      },

      //输入楼层
      inputArea(e) {
        console.log(e);
        this.filterWords.area.forEach((item) => {
          item.selected = false;
        });
        console.log(e.value);
        this.house_filter.area = {
          gte: e.value,
          lte: e.value,
        };
        this.s_filter.area = this.house_filter.area;
      },

      navToHouseDetail() {
        console.log(1)
      },

      async tabSelect(e) {
        let index = e.currentTarget.dataset.index;

        if (this.TabIndex == 0) {
          this.reqList.all = [...this.houseList];
        } else if (this.TabIndex == 1) {
          this.reqList.rushed = [...this.houseList];
        } else if (this.TabIndex == 2) {
          this.reqList.completed = [...this.houseList];
        }

        this.TabIndex = index;
        this.scrollLeft = (index - 1) * 60;
        this.keyword = "";
        this.page = 0;
        this.houseList = [];

        console.log(this.reqList);
        if (index == 0) {
          this.reqUrl = "/house/survey/list";
          console.log(this.reqList.all);
          console.log(this.reqList.all.length);
          if (this.reqList.all.length > 0) {
            this.houseList = [...this.reqList.all];
            this.ShowNodata = false;
            return;
          }
        } else if (index == 1) {
          this.reqUrl = "/house/survey/rushed";
          if (this.reqList.rushed.length > 0) {
            this.houseList = [...this.reqList.rushed];
            this.ShowNodata = false;
            return;
          }
        } else if (index == 2) {
          this.reqUrl = "/house/survey/completed";
          // console.log(this.reqList.completed);
          // console.log(this.reqList.completed.length);
          if (this.reqList.completed.length > 0) {
            this.houseList = [...this.reqList.completed];
            this.ShowNodata = false;

            return;
          }
        }
        this.getSearchLists(this.page);
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
  page {
    background: #ffffff;
  }

  .container {
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* 隐藏scroll-view滚动条*/

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }

  .tui-header-box {
    width: 100%;
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
  }

  .tui-header-screen {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    z-index: 9;
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
    padding: 20rpx 0 120rpx 0;
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
