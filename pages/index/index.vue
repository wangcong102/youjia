<template>
  <view class="container">
    <!--header-->
    <view class="tui-header-box bg-themeColor">
      <view class="tui-header" :style="{ width: width + 'px', height: height + 'px' }">
        <view class="padding-sm"></view>
        <view class="tui-searchbox tui-search-mr" :style="{ marginTop: inputTop + 'px' }">
          <icon type="search" :size="13" color="#999"></icon>
          <input class="tui-search-text text-sm" type="text" placeholder="搜索楼房" :value="keyword" confirm-type="search"
            @confirm="search" @search="search" @input="inputKeyWord" />
        </view>
      </view>
    </view>
    <!--header-->

    <!--screen-->
    <view class="tui-header-screen" :style="'top:' + height + 'px'">
      <view class="tui-screen-top">
        <view class="tui-top-item" @tap="screen" data-index="1">
          <span :class="['iconfont', 'icon-duoxuankuang' , showSlide?'text-blue':'']"></span>
        </view>
        <view class="tui-top-item" @tap="screen" data-index="2">
          <text>筛选</text>
          <tui-icon name="screen" size="12" color="#333" tui-icon-class="tui-ml"></tui-icon>
        </view>
      </view>
      <view class="tui-screen-bottom">
        <block v-for="(item, index) in attrArr" :key="index">
          <view :class="
              'tui-bottom-item ' +
              (item.isActive ? 'tui-btmItem-active' : '') +
              ' ' +
              (attrIndex == index ? 'tui-btmItem-tap' : '')
            " :data-index="index" @tap="btnDropChange">
            <view :class="'tui-bottom-text ' + (attrIndex == index ? 'tui-active' : '')">
              {{ item.isActive ? item.selectedName : item.name }}
            </view>
            <tui-icon :name="attrIndex == index ? 'arrowup' : 'arrowdown'" size="14"
              :color="attrIndex == index || item.isActive ? '#ffffff' : '#444444'" tui-icon-class="tui-ml"
              v-if="item.list.length>0"></tui-icon>
          </view>
        </block>
      </view>
    </view>
    <!--screen-->
    <!--list-->
    <block v-if="!ShowNodata">
      <!--list-->
      <view class="tui-product-list" :style="'margin-top:' + (dropScreenH) + 'rpx'">
        <view class="tui-product-container">
          <block v-for="(item, index) in houseList" :key="index">
            <tui-slide-view :buttons="slideButtons(index, item)" @click="slideClick" height="90%" :data-index="index"
              :show="showSlide" :showMask="!showSlide" :disable="userInfo.role=='member'">
              <navigator :url="'/pages/houseDetails/houseDetails?houseId=' + item.houseId+'&house='+encodeURIComponent(JSON.stringify(item))" open-type="navigate"
                hover-class="none" @click="subscribeMessage">
                <house :house="item"></house>
              </navigator>
            </tui-slide-view>
          </block>
        </view>
      </view>
      <!--list-->
    </block>
    <block v-else>
      <view class="nodata" :style="'margin-top:' + (dropScreenH + 18) + 'rpx'">
        <img class="nodataImg" src="https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/NoData.png" />
      </view>
    </block>

    <!--加载loading-->
    <tui-loadmore v-if="loading" :index="3" type="primary"></tui-loadmore>
    <tui-nomore v-if="!pullUpOn" backgroundColor="#f7f7f7"></tui-nomore>
    <!--加载loading-->

    <!--顶部下拉筛选弹层 属性-->
    <tui-top-dropdown bgcolor="#f7f7f7" :show="dropScreenShow" :paddingbtm="110" :translatey="dropScreenH"
      @close="btnCloseDrop">
      <scroll-view class="tui-scroll-box" scroll-y="" :scroll-top="scrollTop">
        <view class="tui-seizeaseat-20"></view>
        <view :hidden="!showRentSection">
          <view class="tui-drawer-title solid-buttom-themeColor"><text class="tui-title-bold text-black">租金</text>
          </view>
          <view class="tui-drawer-content">
            <input placeholder-class="tui-phcolor" class="tui-input-out index-top" placeholder="最低价" type="number"
              :data-index="0" :value="house_filter.rent.gte" @confirm="btnSure" @input="inputRentSection"
              @focus="resetRent" maxlength="-1" />
            <tui-icon name="reduce" color="var(--themeColor)" size="14"></tui-icon>
            <input placeholder-class="tui-phcolor" class="tui-input-out" placeholder="最高价" type="number" :data-index="1"
              :value="house_filter.rent.lte" @confirm="btnSure" @input="inputRentSection" @focus="resetRent"
              maxlength="-1" />
          </view>
        </view>
        <view :hidden="!showRentSection">
          <view class="tui-drawer-title"><text class="tui-title-bold text-black">排序</text></view>
          <view v-for="(item, index) in dropdownList" :key="index" @tap.stop="dropdownItem" :data-index="index" :class="
              'solid-right text-center tui-drop-item ' +
              (item.selected ? 'tui-bold' : '') +
              ' '
            ">
            <span :class="
                'iconfont ' +
                item.iconfont +
                ' ' +
                (item.selected == true ? 'text-themeColor' : 'text-grey')
              "></span>
            <text class="tui-ml tui-middle text-black">{{ item.name }}</text>
          </view>
        </view>
        <view class="tui-seizeaseat-20"></view>

        <view v-for="(item, index) in attrData" :key="index"
          :class="'tui-drop-item ' + (item.selected ? 'tui-bold' : '') + ' text-center'" @tap.stop="btnSelected"
          :data-index="index">
          <tui-icon name="check" size="16" color="var(--themeColor)" :bold="true" v-show="item.selected"
            tui-icon-class="tui-middle"></tui-icon>
          <text class="tui-ml tui-middle">{{ item.filterWord }}</text>
        </view>

        <view class="tui-seizeaseat-30"></view>
      </scroll-view>
      <view class="tui-drop-btnbox">
        <view class="tui-drop-btn tui-btn-white" hover-class="tui-white-hover" hover-stay-time="150" @tap="reset">重置
        </view>
        <view class="tui-drop-btn tui-btn-themeColor" hover-class="tui-themeColor-hover" hover-stay-time="150"
          @tap="btnSure">确定</view>
      </view>
    </tui-top-dropdown>
    <!--顶部下拉筛选弹层 属性-->

    <!--右抽屉弹层 筛选 -->
    <tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
      <view class="tui-drawer-box" :style="'padding-top:' + height + 'px'">
        <scroll-view class="tui-drawer-scroll" scroll-y="" :style="'height:' + drawerH + 'px'">
          <view class="tui-drawer-title">
            <text class="tui-title-bold">租金区间</text>
            <view class="tui-all-box">
              <view class="tui-attr-right over-over"><button class="cu-btn bg-gray shadow radius sm" @tap="emptyRent">
                  清空
                </button></view>
            </view>
          </view>
          <view class="tui-drawer-content">
            <input placeholder-class="tui-phcolor" class="tui-input-out index-top" placeholder="最低价" type="number"
              :data-index="0" :value="house_filter.rent.gte" @confirm="drawerSure" @input="inputRentSection"
              maxlength="-1" />
            <tui-icon name="reduce" color="var(--blue)" size="14"></tui-icon>
            <input placeholder-class="tui-phcolor" class="tui-input-out" placeholder="最高价" type="number" :data-index="1"
              :value="house_filter.rent.lte" @confirm="drawerSure" @input="inputRentSection" maxlength="-1" />
          </view>
          <view class="tui-drawer-title">
            <text class="tui-title-bold">状态</text>
            <view class="tui-all-box">
              <view class="tui-attr-right over-over"><button class="cu-btn bg-gray shadow radius sm"
                  @tap="selectAllIsRented">
                  全选
                </button></view>
            </view>
          </view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.isRented" :key="index"
              :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterIsRented">
              <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
            </view>
          </view>
          <view class="tui-drawer-title"><text class="tui-title-bold">地铁口</text></view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.subways" :key="index"
              :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterSubways">
              <view class="tui-attr-ellipsis">
                <view class="cu-tag badge shadow" v-if="item.selected">
                  {{item.count>99?(item.count>999?'999+':'99+'):item.count}}
                </view>
                {{ item.filterWord }}
              </view>
            </view>
          </view>
          <view class="tui-safearea-bottom"></view>
          <view class="tui-drawer-title"><text class="tui-title-bold">地段</text></view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.districts" :key="index"
              :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterDistricts">
              <view class="tui-attr-ellipsis">
                <view class="cu-tag badge shadow" v-if="item.selected">
                  {{item.count>99?(item.count>999?'999+':'99+'):item.count}}
                </view>
                {{ item.filterWord }}
              </view>
            </view>
          </view>
          <view class="tui-drawer-title"><text class="tui-title-bold">标签</text></view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.tags" :key="index"
              :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterTags">
              <view class="tui-attr-ellipsis">
                <view class="cu-tag badge shadow" v-if="item.selected">
                  {{item.count>99?(item.count>999?'999+':'99+'):item.count}}
                </view>
                {{ item.filterWord }}
              </view>
            </view>
          </view>
          <view class="tui-drawer-title">
            <text class="tui-title-bold">楼层</text>
            <view class="tui-all-box">
              <tui-numberbox :gte="0" :lte="1000" :value="
                  house_filter.floor.atFloor.gte == house_filter.floor.atFloor.lte
                    ? house_filter.floor.atFloor.gte
                    : 0
                " @change="inputFloor"></tui-numberbox>
            </view>
          </view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.floor" :key="index"
              :class="'tui-attr-item  ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterFloor">
              <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
            </view>
          </view>
          <view class="tui-drawer-title">
            <text class="tui-title-bold">面积m²</text>
            <view class="tui-all-box">
              <tui-numberbox :gte="1" :lte="10" :value="
                  house_filter.area.gte == house_filter.area.lte
                    ? house_filter.area.gte
                    : 0
                " @change="inputArea">
              </tui-numberbox>
            </view>
          </view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.area" :key="index"
              :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterArea">
              <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
            </view>
          </view>
          <view class="tui-drawer-title">
            <text class="tui-title-bold">房东</text>
            <view class="tui-all-box"></view>
          </view>
          <view class="tui-drawer-content tui-flex-attr">
            <view v-for="(item, index) in filterWords.landlords" :key="index"
              :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
              @tap.stop="filterLandlords">
              <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
            </view>
          </view>
          <view class="tui-safearea-bottom"></view>
          <view class="tui-safearea-bottom"></view>
        </scroll-view>
        <view class="tui-attr-btnbox">
          <view class="tui-attr-safearea">
            <view class="tui-drawer-btn tui-drawerbtn-blue text-blue" hover-class="tui-white-hover"
              hover-stay-time="150" @tap="reset">重置</view>
            <view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-blue-hover" hover-stay-time="150"
              @tap="drawerSure">确定</view>
          </view>
        </view>
      </view>
    </tui-drawer>
    <!--右抽屉弹层 筛选-->
    <!-- 悬浮按钮 -->
    <!-- #ifdef MP-->
    <!-- 悬浮按钮 -->
    <tui-fab @click="fabClick" :btnList="fabBtnList" :bottom="50" :right="50" :maskClosable="true" :custom="true"
      v-if="!drawer">
      <template v-slot:default>
        <view class="flex justify-center align-center">
          <image style="width: 60rpx; height: 60rpx" src="/static/pages/index/more.png"></image>
        </view>
      </template>
    </tui-fab>
    <!-- #endif -->
    <!-- #ifndef MP -->
    <tui-fab @click="fabClick" :btnList="fabBtnList" :bottom="120" :right="50" :maskClosable="true" :custom="true"
      v-if="!drawer">
      <template v-slot:default>
        <view class="flex justify-center align-center">
          <image style="width: 60rpx; height: 60rpx" src="/static/pages/index/more.png"></image>
        </view>
      </template>
    </tui-fab>
    <!-- #endif -->

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
  const base64 = require("../../common/crypto/base64");

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
        tabIndex: 0,
        //顶部筛选索引
        drawer: false,
        //筛选侧栏开关
        drawerH: 0,
        //抽屉内部scrollview高度
        selectedName: "排序",
        selectH: 0,
        dropdownList: [{
            name: "从低到高",
            selected: false,
            iconfont: "icon-paixu-shengxu1",
          },
          {
            name: "从高到低",
            selected: false,
            iconfont: "icon-paixu-jiangxu1",
          },
        ],
        attrArr: [{
            name: "地铁口",
            selectedName: "地铁口",
            isActive: false,
            list: [{
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
              {
                filterWord: "天平架",
                count: 35,
                selected: false,
              },
              {
                filterWord: "京溪南方医院",
                count: 27,
                selected: false,
              },
            ],
          },
          {
            name: "户型",
            selectedName: "户型",
            isActive: false,
            list: [{
                data: "0",
                filterWord: "单间",
                selected: false,
              },
              {
                data: "1",
                filterWord: "一房",
                selected: false,
              },
              {
                data: "2",
                filterWord: "两房",
                selected: false,
              },
              {
                data: "3",
                filterWord: "三房",
                selected: false,
              },
            ],
          },
          {
            name: "价格",
            selectedName: "价格",
            isActive: false,
            list: [{
                filterWord: "0-1000",
                selected: false,
              },
              {
                filterWord: "1000-1500",
                selected: false,
              },
              {
                filterWord: "1500-2000",
                selected: false,
              },
              {
                filterWord: "2000-2500",
                selected: false,
              },
              {
                filterWord: "2500-3000",
                selected: false,
              },
              {
                filterWord: "3000-4000",
                selected: false,
              },
            ],
          },
        ],
        houseList: [],
        page: 0,
        pageSize: 40,
        value: "",
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
        house_filter: {
          floor: {
            totalFloor: {
              gte: 0,
              lte: 5,
            },
            atFloor: {
              gte: 0,
              lte: 5,
            },
          },
          rent: {
            gte: "",
            lte: "",
          },
          houseType: {
            toilets: 1,
            halls: 1,
            rooms: 2,
          },
          region: {
            city: "广州市",
            province: "广东省",
            area: "天河区",
          },
          districts: [],
          area: {
            gte: 0,
            lte: 100,
          },
          isRented: [false],
          tags: [],
          payMethod: {
            pay: 1,
            mortgage: 2,
          },
          subways: [],
          useWay: "",
          phone: "",
          direction: "",
          address: "",
          dueTime: "2017-11-19",
          landlord: "廖顺海",
          houseNum: "701",
        },
        s_filter: {
          rent: {},
          isRented: [false],
        },
        inputTop: "",
        ShowNodata: false,
        isActive: "",
        showRentSection: true,
        selected: "",
        showLoading: false,
        loading: true,
        loadingText: "",
        pullUpOn: true,
        pageIndex: 0,
        fabBtnList: [{
            bgColor: "#bfa7f5",
            text: "配房",
            fontSize: 28,
            color: "#fff",
            imgUrl: "/static/pages/index/distribution_house.png",
            imgHeight: 50,
            imgWidth: 50,
          },
          {
            bgColor: "#bfa7f5",
            text: "取消配房",
            fontSize: 28,
            color: "#fff",
            imgUrl: "/static/pages/index/distribution_house_cancel.png",
            imgHeight: 50,
            imgWidth: 50,
          },
          {
            bgColor: "#99ccff",
            text: "如何使用",
            fontSize: 28,
            color: "#fff",
            imgUrl: "/static/pages/index/question.png",
            imgHeight: 50,
            imgWidth: 50,
          },
        ],
        allotList: [],
        showSlide: false,
        userInfo: {},
        sortby: ["atTop", "at_create"],
        order: "desc",
        needSubscribe: false,
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
      this.userInfo = uni.getStorageSync("userInfo");
      this.goTop();
      await this.getFilterWords();
      this.getSearchLists();
      this.judgeIfNeedSubscribe();
    },

    onShow() {
      // var house_filter = uni.getStorageSync("house_filter");
      // if (!house_filter) {
      //   this.getFilterWords();
      // }
    },

    //下拉刷新
    async onPullDownRefresh() {
      this.page = 0;
      this.houseList = [];
      await this.getSearchLists(this.page);
      uni.stopPullDownRefresh();
    },

    onReachBottom: function() {
      console.log("onReachBottom");
      this.page += 1;
      this.getSearchLists(this.page);
    },
    methods: {
      px(num) {
        return uni.upx2px(num) + "px";
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
        this.keyword = e.detail.value;
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
        this.loading = true;
        let houseList = await this.http
          .post("/house/search", {
            data: {
              page: this.page,
              pageSize: this.pageSize,
              keyword: this.keyword,
              sortby: this.sortby,
              s_filter: this.s_filter,
              order: this.order,
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
        this.loading = false;
        this.houseList = this.houseList.concat(houseList);
        this.ShowNodata = houseList == "" && this.houseList == "" ? true : false;
      },

      //下拉栏点击打开
      btnDropChange(e) {
        let index = e.currentTarget.dataset.index;
        let arr = this.attrArr[index].list;

        if (arr.length === 0) {
          let isActive = `attrArr[${index}].isActive`;
          this[isActive] = !this.attrArr[index].isActive;
          console.log(this.attrArr[index].isActive);
        } else {
          let isActive = `attrArr[${index}].isActive`;
          this.attrData = arr;
          this.attrIndex = index;
          this[isActive] = false;
          this.dropScreenShow = true;
          console.log(this.attrArr[index].list);
        }

        if (index == 2) {
          this.showRentSection = true;
        } else {
          this.showRentSection = false;
        }
      },

      //下拉栏选择
      async btnSelected(e) {
        console.log(e);
        var index = e.currentTarget.dataset.index;
        let isSelect = this.attrData[index].selected;
        await this.attrData.forEach((item) => {
          item.selected = false;
        });
        await this.filterWords.subways.forEach((item) => {
          item.selected = false;
        });

        if (isSelect) {
          this.attrData[index].selected = false;
        } else {
          this.attrData[index].selected = true;
        }

        var selected = `attrArr[${this.attrIndex}].list`;
        this.attrData = this.attrData;
        this[selected] = this.attrData;
        var {
          attrIndex
        } = this;
        var {
          attrArr
        } = this;
        var {
          s_filter
        } = this;

        if (isSelect) {
          if (attrIndex == 0) {
            this.filterWords.subways[index].selected = false;
            this.house_filter.subways = [];
            delete this.s_filter.subways;
          } else if (attrIndex == 1) {
            // delete this.house_filter.houseType;
            this.house_filter.houseType = {};
            delete this.s_filter.houseType;
          } else if (attrIndex == 2) {
            // delete this.house_filter.rent;
            this.house_filter.rent = {};
            delete this.s_filter.rent;
            console.log(this.s_filter.rent);
          }
        } else {
          if (attrIndex == 0) {
            this.house_filter.subways = [
              attrArr[attrIndex].list[index].filterWord,
            ];
            this.filterWords.subways[index].selected = true;
            this.s_filter.subways = this.house_filter.subways;
          } else if (attrIndex == 1) {
            if (index == 0) {
              this.house_filter.houseType = {
                rooms: 1,
                halls: 0,
                toilets: 1,
              };
              this.s_filter.houseType = this.house_filter.houseType;
            } else {
              this.house_filter.houseType = {
                rooms: index,
                halls: 1,
              };
              this.s_filter.houseType = this.house_filter.houseType;
            }
            console.log(s_filter.houseType);
          } else if (attrIndex == 2) {
            let rent = attrArr[attrIndex].list[index].filterWord;
            rent = rent.split("-");
            rent[0] = parseInt(rent[0]);
            rent[1] = parseInt(rent[1]);
            this.house_filter.rent = {
              gte: rent[0],
              lte: rent[1],
            };
            this.s_filter.rent = this.house_filter.rent;
            console.log("修改租金");
            console.log(this.s_filter.rent);
          }
        }
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
      // 下拉栏确认
      btnSure() {
        let index = this.attrIndex;
        let arr = this.attrData;
        let active = false;
        let attrName = "";
        let rent = this.house_filter.rent;
        for (let item of arr) {
          if (item.selected) {
            active = true;
            attrName += attrName ? ";" + item.filterWord : item.filterWord;
            console.log(attrName);
          }
        }

        let isActive = `attrArr[${index}].isActive`;
        let selectedName = `attrArr[${index}].selectedName`;
        this.btnCloseDrop();
        this[isActive] = active;
        this[selectedName] = attrName;

        // 选中价格时候特殊处理
        if (index == 2) {
          if (rent.gte != "" || rent.lte != "") {
            this.attrArr[2].selectedName = rent.gte + "-" + rent.lte;
            this[selectedName] =
              this.house_filter.rent.gte + "-" + this.house_filter.rent.lte;
          }
        }
        this.page = 0;
        this.houseList = [];
        this.getSearchLists(this.page);
        this.goTop();
      },

      //价格排序点击
      dropdownItem(e) {
        let index = e.currentTarget.dataset.index;
        let {
          dropdownList
        } = this;
        let isSelect = dropdownList[index].selected;
        dropdownList.forEach((item) => (item.selected = false));
        dropdownList[index].selected = !isSelect;
        console.log(dropdownList[index].name);
        this.sortby = Array.from(new Set(this.sortby));
        if (isSelect) {
          this.order = "desc";
          let index = this.sortby.indexOf("rent");
          if (index != -1) {
            // this.sortby.splice(index, 1);
            this.sortby = ["atTop", "at_create"];
          }
        } else {
          if (index == 0) {
            //从高到低
            // this.sortby = ["rent"].concat(this.sortby);
            this.sortby = ["rent"];
            this.order = "asc";
          } else if (index == 1) {
            //从低到高
            // this.sortby = ["rent"].concat(this.sortby);
            this.sortby = ["rent"];
            this.order = "desc";
          }
        }
        this.sortby = Array.from(new Set(this.sortby));
        this.dropdownList = dropdownList;
      },
      //筛选栏
      screen(e) {
        let index = e.currentTarget.dataset.index;
        this.btnCloseDrop();
        if (index == 0) {
          this.showDropdownList();
        } else if (index == 1) {
          // 管理列表变化
          this.showSlide = !this.showSlide;
        } else if (index == 2) {
          this.drawer = true;
        }
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
          duration: 100,
        });
      },

      //格式化日期YY-MM-DD
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

      subscribeMessage() {
        // 提示请求统一订阅消息的只有boss以及boss以上职位
        // #ifdef MP
        if (this.needSubscribe) {
          this.http
            .post("user/subscribe/count", {
              data: {
                tmplId: 'QEI4Cu6VUrIZ0OmgXLlD8CXsUdb-XMF2kH3BcW7Q8dQ',
                operate: "add"
              },
            }).then(res => {
              if (res.data.count > 99) {
                this.needSubscribe = True
              }
            })
          uni.requestSubscribeMessage({
            tmplIds: ["QEI4Cu6VUrIZ0OmgXLlD8CXsUdb-XMF2kH3BcW7Q8dQ"],
            success(res) {
              console.log(res)
            }
          });
        }
        // #endif

      },
      // 判断是否需要请求订阅消息
      judgeIfNeedSubscribe() {
        let role2Code = this.utils.role2Code;
        if (role2Code(this.userInfo.role) >= role2Code("boss")) {
          this.needSubscribe = true
        }
        this.http
          .post("user/subscribe/count", {
            data: {
              tmplId: 'QEI4Cu6VUrIZ0OmgXLlD8CXsUdb-XMF2kH3BcW7Q8dQ',
              operate: "get"
            },
          }).then(res => {
            if (res.data.count > 99) {
              this.needSubscribe = false
            }
          })

      },
      showDropdownList: function() {
        this.selectH = 246;
        this.tabIndex = 0;
      },
      hideDropdownList: function() {
        this.selectH = 0;
      },

      //侧边筛选关闭
      closeDrawer: function() {
        this.drawer = false;
      },

      slideButtons(index, house) {
        // 非管理员不显示删除按钮
        let role2Code = this.utils.role2Code;
        if (role2Code(this.userInfo.role) >= role2Code("boss")) {
          // boss权限以上可删除
          return [{
              src: "/static/pages/index/add_0.png",
              width: "48rpx",
              height: "48rpx",
              data: {
                operate: "addAllot",
                index: index,
                house: house
              },
            },
            {
              text: "删除",
              color: "#fff",
              background: "#FA5151",
              data: {
                operate: "delete",
                index: index,
                house: house
              },
            },
          ];
        } else {
          return [{
            src: "/static/pages/index/add_0.png",
            width: "48rpx",
            height: "48rpx",
            data: {
              operate: "addAllot",
              index: index,
              house: house
            },
          }, ];
        }
      },
      async slideClick(e) {
        console.log(e);
        let {
          operate,
          index,
          house
        } = e.data;
        if (operate == "addAllot") {
          let exist = this.allotList.findIndex((item) => {
            return item == house.houseId;
          });
          if (exist == -1) {
            // 添加配房列表
            this.houseList[index].checked = true;
            this.allotList.push(house.houseId);
            this.showTips("加入配房列表", "success", "bottom", 1000);
          } else {
            // 移除配房列表
            this.houseList[index].checked = false;
            this.allotList.forEach((item, i) => {
              if (item == house.houseId) {
                this.allotList.splice(i, 1);
                this.showTips("移出配房列表", "gray", "bottom", 1000);
              }
            });
          }
          console.log(this.houseList[index].checked);
        } else if (operate == "delete") {
          console.log("删除");
          await this.deleteHosue(house.houseId);
          this.houseList.splice(index, 1);
        }
      },
      // 删除房源
      async deleteHosue(houseId) {
        await this.http
          .post("house/delete", {
            data: {
              houseId: houseId,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.showTips(res.msg, "success");
            } else {
              this.showTips(res.msg, "warning");
            }
          });
      },
      // 悬浮框点击
      fabClick(e) {
        let {
          index
        } = e;
        if (index == 0) {
          if (this.allotList.length <= 0) {
            this.showTips("请选中配房的房源", "gray", "bottom", 1500);
            return;
          }
          this.http
            .post("house/allot", {
              data: {
                allot_list: this.allotList,
                type: 1,
                expire: 21600,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.code == 200) {
                // 复制到剪贴板
                uni.setClipboardData({
                  data: "https://home.u-home.cc/user/#/pages/allotHouse/allotHouse?allot_id=" +
                    res.data.allot_id,
                });
                uni.showToast({
                  title: "已复制到剪切板",
                  icon: "none",
                  duration: 1000,
                });
                /* #ifndef MP */
                // // wx22d72b15eec19543
                // uni.navigateTo({
                //   url:
                //     // "/pages/allotHouse/allotHouse?allot_id=" + res.data.allot_id,
                //     "/pages/webview/webview?url=" +
                //     base64.encode(
                //       "https://home.u-home.cc/user/#/pages/allotHouse/allotHouse?allot_id=" +
                //         res.data.allot_id
                //     ),
                // });
                /* #endif */

                /* #ifdef MP */
                // uni.openEmbeddedMiniProgram({
                // 	appId: "wx22d72b15eec19543",
                // 	path: "/pages/allotHouse/allotHouse?allot_id=" + res.data.allot_id,
                // 	extraData: {
                // 		foo: "bar",
                // 	},
                // 	envVersion: "release",
                // 	success(res) {
                // 		console.log(res);
                // 	},
                // 	fail(res) {
                // 		console.log(res);
                // 	},
                // });
                /* #endif */
              } else {
                this.showTips(res.msg, "warning");
              }
            });
          console.log(this.allotList);
        } else if (index == 1) {
          console.log("取消配房选择");
          this.allotList = [];
          this.showSlide = false;
          this.houseList.forEach((item) => {
            item.checked = false;
          });
          this.showTips("已取消", "gray", "bottom");
        } else if (index == 2) {
          console.log("教程");
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
    z-index: 999;
    left: 0;
    top: 0;
  }

  .tui-header {
    display: flex;
    align-items: flex-start;
  }

  .tui-back {
    margin-left: 8rpx;
    height: 32px !important;
    width: 32px !important;
    display: block !important;
  }

  .tui-searchbox {
    width: 100%;
    height: 30px;
    margin-right: 20rpx;
    border-radius: 15px;
    font-size: 12px;
    background: #f7f7f7;
    padding: 3px 10px;
    box-sizing: border-box;
    color: #999;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .tui-searchbox input {
    width: calc(100% - 60rpx);
  }

  .tui-search-text {
    padding-left: 16rpx;
  }

  .tui-search-key {
    max-width: 80%;
    height: 100%;
    padding: 0 16rpx;
    margin-left: 12rpx;
    display: flex;
    align-items: center;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    /* transform: scale(0.9);
    transform-origin: 0 center; */
  }

  .tui-key-text {
    box-sizing: border-box;
    padding-right: 12rpx;
    font-size: 12px;
    line-height: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*screen*/

  .tui-header-screen {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    z-index: 999;
  }

  .tui-screen-top,
  .tui-screen-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #333;
  }

  .tui-screen-top {
    height: 88rpx;
    position: relative;
    background: #fff;
  }

  .tui-top-item {
    height: 28rpx;
    line-height: 28rpx;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tui-topitem-active {
    color: var(--themeColor);
  }

  .tui-screen-bottom {
    height: 100rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    align-items: center;
    overflow: hidden;
  }

  .tui-bottom-text {
    line-height: 24rpx;
    max-width: 82%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tui-bottom-item {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12rpx;
    box-sizing: border-box;
    background: #f7f7f7;
    margin-right: 20rpx;
    white-space: nowrap;
    height: 60rpx;
    border-radius: 40rpx;
  }

  .tui-bottom-item:last-child {
    margin-right: 0;
  }

  .tui-btmItem-active {
    background: var(--themeColor);
    color: #fff;
    font-weight: bold;
    position: relative;
  }

  .tui-btmItem-active::after {
    content: "";
    position: absolute;
    border: 1rpx solid var(--themeColor);
    width: 100%;
    height: 100%;
    border-radius: 40rpx;
    left: 0;
    top: 0;
  }

  .tui-attrItem-active {
    background: var(--themeColor) !important;
    color: #fff;
    font-weight: bold;
    position: relative;
  }

  .tui-attrItem-active::after {
    content: "";
    position: absolute;
    border: 1rpx solid var(--themeColor);
    width: 100%;
    height: 100%;
    border-radius: 40rpx;
    left: 0;
    top: 0;
  }

  .tui-btmItem-tap {
    position: relative;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .tui-btmItem-tap::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 22rpx;
    background: #f7f7f7;
    left: 0;
    top: 58rpx;
  }

  .tui-bold {
    font-weight: bold;
  }

  .tui-active {
    color: var(--themeColor);
  }

  .tui-ml {
    margin-left: 6rpx;
  }

  .tui-seizeaseat-20 {
    height: 20rpx;
  }

  .tui-seizeaseat-30 {
    height: 30rpx;
  }

  .tui-middle {
    vertical-align: middle;
  }

  /*screen*/

  /*顶部下拉选择 属性*/

  .tui-scroll-box {
    width: 100%;
    height: 480rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 99;
    color: #fff;
    font-size: 30rpx;
    word-break: break-all;
  }

  .tui-drop-item {
    color: #333;
    height: 80rpx;
    font-size: 28rpx;
    padding: 20rpx 40rpx 20rpx 40rpx;
    box-sizing: border-box;
    display: inline-block;
    width: 50%;
  }

  .tui-drop-range-item {
    color: #333;
    height: 80rpx;
    font-size: 28rpx;
    padding: 20rpx 40rpx 20rpx 40rpx;
    box-sizing: border-box;
    display: inline-block;
    width: 30%;
  }

  .tui-drop-btnbox {
    width: 100%;
    height: 100rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
  }

  .tui-drop-btn {
    width: 50%;
    font-size: 32rpx;
    text-align: center;
    height: 100rpx;
    line-height: 100rpx;
    border: 0;
  }

  .tui-btn-red {
    background: #e41f19;
    color: #fff;
  }

  .tui-btn-themeColor {
    background: var(--themeColor);
    color: #fff;
  }

  .tui-red-hover {
    background: #c51a15 !important;
    color: #e5e5e5;
  }

  .tui-btn-white {
    background: #fff;
    color: #333;
  }

  .tui-white-hover {
    background: #ffffff;
    color: #059de9;
  }

  /*顶部下拉选择 属性*/

  /*顶部下拉选择 综合*/

  .tui-dropdownlist {
    width: 100%;
    position: absolute;
    background: #fff;
    border-bottom-left-radius: 24rpx;
    border-bottom-right-radius: 24rpx;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 10rpx;
    padding-bottom: 26rpx;
    left: 0;
    top: 88rpx;
    visibility: hidden;
    transition: all 0.2s ease-in-out;
    z-index: 999;
  }

  .tui-dropdownlist-show {
    visibility: visible;
  }

  .tui-dropdownlist-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: -1;
    transition: all 0.2s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }

  .tui-mask-show {
    opacity: 1;
    visibility: visible;
  }

  .tui-dropdownlist-item {
    color: #333;
    height: 70rpx;
    font-size: 28rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /*顶部下拉选择 综合*/

  /* .tui-drawer-scroll {
    height: 100%;
  } */

  .tui-drawer-box {
    width: 686rpx;
    font-size: 24rpx;
    overflow: hidden;
    position: relative;
    padding-bottom: 100rpx;
  }

  .tui-drawer-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    box-sizing: border-box;
    height: 80rpx;
  }

  .tui-title-bold {
    font-size: 26rpx;
    font-weight: bold;
    flex-shrink: 0;
  }

  .tui-location {
    margin-right: 6rpx;
  }

  .tui-attr-right {
    width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }

  .tui-all-box {
    width: 90%;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .tui-drawer-content {
    padding: 0 30rpx 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
  }

  .tui-input {
    border: 0;
    height: 64rpx;
    border-radius: 32rpx;
    width: 45%;
    background: #f7f7f7;
    text-align: center;
    font-size: 24rpx;
    color: #333;
  }

  .tui-input-out {
    border: 0;
    height: 64rpx;
    border-radius: 5rpx;
    width: 45%;
    background: var(--ghostWhite);
    text-align: center;
    font-size: 24rpx;
    color: #333;
  }

  .tui-phcolor {
    text-align: center;
    color: #b2b2b2;
    font-size: 24rpx;
  }

  .tui-flex-attr {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .tui-attr-item {
    width: 30%;
    height: 64rpx;
    background: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4rpx;
    box-sizing: border-box;
    border-radius: 32rpx;
    margin-right: 5%;
    margin-bottom: 5%;
    position: relative;
  }

  .tui-attr-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 96%;
    text-align: center;
  }

  .tui-attr-item:nth-of-type(3n) {
    margin-right: 0%;
  }

  .tui-attr-btnbox {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 0 30rpx;
    background: #fff;
  }

  .tui-attr-safearea {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .tui-safearea-bottom {
    width: 100%;
    height: env(safe-area-inset-bottom);
  }

  .tui-attr-btnbox::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border-top: 1rpx solid #eaeef1;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .tui-drawer-btn {
    width: 47%;
    text-align: center;
    height: 60rpx;
    border-radius: 30rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .tui-drawerbtn-themeColor {
    border: 1rpx solid var(--themeColor);
  }

  .tui-drawerbtn-primary {
    background: var(--themeColor);
    color: #fff;
  }

  /* 商品列表*/

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
    width: 100%;
    display: block;
    height: 200rpx !important;
    border-radius: 15rpx 0 0 15rpx;
  }

  .tui-pro-img {
    position: relative;
    width: 100%;
    display: block;
    height: 200rpx !important;
    border-radius: 15rpx 15rpx 0 0;
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

  .tui-pro-tit-list {
    font-size: 30rpx;
    text-shadow: 1rpx 1rpx 5rpx rgba(0, 0, 0, 0.1);
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
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

  .tui-pro-subtit-list {
    font-size: 24rpx;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
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

  .tui-sale-price {
    font-size: 42rpx;
    font-weight: 600;
    color: var(--themeColor);
    letter-spacing: 3rpx;
    text-shadow: 1rpx 1rpx 5rpx rgb(0, 129, 255, 0.2);
  }

  .tui-factory-price {
    font-size: 24rpx;
    color: #a0a0a0;
    text-decoration: line-through;
    padding-left: 12rpx;
  }

  .tui-pro-pay {
    padding-top: 10rpx;
    font-size: 24rpx;
    color: #656565;
  }

  /* 商品列表*/

  .house-tag .tag .cu-tag {
    vertical-align: middle;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: auto;
    font-family: Helvetica Neue, Helvetica, sans-serif;
    white-space: nowrap;
    font-size: 18rpx;
    margin-top: 12rpx;
    margin-left: 0rpx;
    margin-right: 8rpx;
    padding: 6rpx 8rpx;
    border-radius: 5rpx;
  }

  .house-tag .tag .cu-tag-list {
    vertical-align: middle;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: auto;
    font-family: Helvetica Neue, Helvetica, sans-serif;
    white-space: nowrap;
    font-size: 20rpx;
    margin-top: 12rpx;
    margin-left: 0rpx;
    margin-right: 10rpx;
    padding: 6rpx 8rpx;
    border-radius: 5rpx;
  }

  .radius-0 {
    border-radius: 0 !important;
  }

  .radius-left-0 {
    border-radius: 40rpx 0 0 40rpx !important;
  }

  .radius-right-0 {
    border-radius: 0 40rpx 40rpx 0 !important;
  }

  .badge {}

  .container {
    padding: 20rpx 0 120rpx 0;
    box-sizing: border-box;
  }

  .header {
    padding: 80rpx 90rpx 60rpx 90rpx;
    box-sizing: border-box;
  }

  .title {
    font-size: 34rpx;
    color: #333;
    font-weight: 500;
  }

  .sub-title {
    font-size: 24rpx;
    color: #7a7a7a;
    padding-top: 18rpx;
  }

  .tui-number-box {
    padding: 40rpx;
    box-sizing: border-box;
    margin-bottom: 30rpx;
    background: #fff;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .animatione {
    transform: translateY(50%);
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
