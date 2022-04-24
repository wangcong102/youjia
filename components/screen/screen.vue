<template>
  <tui-drawer mode="right" :visible="show" @close="closeDrawer">
    <view class="tui-drawer-box" :style="'padding-top:' + height + 'px'">
      <scroll-view class="tui-drawer-scroll " scroll-y="100" :style="'height:' + drawerH + 'px'">
        <view class="tui-drawer-title" v-if="showRent">
          <text class="tui-title-bold">租金区间</text>
          <view class="tui-all-box">
            <view class="tui-attr-right over-over"><button class="cu-btn bg-gray shadow radius sm" @tap="emptyRent">
                清空
              </button></view>
          </view>
        </view>
        <view class="tui-drawer-content " v-if="showRent">
          <input placeholder-class="tui-phcolor" class="tui-input-out index-top" placeholder="最低价" type="number"
            :data-index="0" :value="house_filter.rent.gte" @confirm="drawerSure" @input="inputRentSection"
            maxlength="-1" />
          <tui-icon name="reduce" color="var(--blue)" size="14"></tui-icon>
          <input placeholder-class="tui-phcolor" class="tui-input-out" placeholder="最高价" type="number" :data-index="1"
            :value="house_filter.rent.lte" @confirm="drawerSure" @input="inputRentSection" maxlength="-1" />
        </view>
        <view class="tui-drawer-title" v-if="showState">
          <text class="tui-title-bold">状态</text>
          <view class="tui-all-box">
            <view class="tui-attr-right over-over"><button class="cu-btn bg-gray shadow radius sm"
                @tap="selectAllIsRented">
                全选
              </button></view>
          </view>
        </view>
        <view class="tui-drawer-content tui-flex-attr" v-if="showState">
          <view v-for="(item, index) in filterWords.isRented" :key="index"
            :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
            @tap.stop="filterIsRented">
            <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
          </view>
        </view>
        <view class="tui-drawer-title" v-if="showSubways"><text class="tui-title-bold">地铁口</text></view>
        <view class="tui-drawer-content tui-flex-attr" v-if="showSubways">
          <view v-for="(item, index) in filterWords.subways" :key="index"
            :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
            @tap.stop="filterSubways">
            <view class="tui-attr-ellipsis">
              <view class="cu-tag badge shadow" v-if="item.selected">
                {{item.count&gt;99?(item.count&gt;999?'999+':'99+'):item.count}}
              </view>
              {{ item.filterWord }}
            </view>
          </view>
        </view>
        <view class="tui-safearea-bottom"></view>
        <view class="tui-drawer-title" v-if="showArea"><text class="tui-title-bold">地段</text></view>
        <view class="tui-drawer-content tui-flex-attr" v-if="showArea">
          <view v-for="(item, index) in filterWords.districts" :key="index"
            :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
            @tap.stop="filterDistricts">
            <view class="tui-attr-ellipsis">
              <view class="cu-tag badge shadow" v-if="item.selected">
                {{item.count&gt;99?(item.count&gt;999?'999+':'99+'):item.count}}
              </view>
              {{ item.filterWord }}
            </view>
          </view>
        </view>
        <view class="tui-drawer-title" v-if="showTags"><text class="tui-title-bold">标签</text></view>
        <view class="tui-drawer-content tui-flex-attr" v-if="showTags">
          <view v-for="(item, index) in filterWords.tags" :key="index"
            :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
            @tap.stop="filterTags">
            <view class="tui-attr-ellipsis">
              <view class="cu-tag badge shadow" v-if="item.selected">
                {{item.count&gt;99?(item.count&gt;999?'999+':'99+'):item.count}}
              </view>
              {{ item.filterWord }}
            </view>
          </view>
        </view>
        <view class="tui-drawer-title" v-if="showFloor">
          <text class="tui-title-bold">楼层</text>
          <view class="tui-all-box">
            <tui-numberbox :gte="0" :lte="1000" :value="
				  house_filter.floor.atFloor.gte == house_filter.floor.atFloor.lte
				    ? house_filter.floor.atFloor.gte
				    : 0
				" @change="inputFloor"></tui-numberbox>
          </view>
        </view>
        <view class="tui-drawer-content tui-flex-attr" v-if="showFloor">
          <view v-for="(item, index) in filterWords.floor" :key="index"
            :class="'tui-attr-item  ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
            @tap.stop="filterFloor">
            <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
          </view>
        </view>
        <view class="tui-drawer-title" v-if="showArea">
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
        <view class="tui-drawer-content tui-flex-attr" v-if="showArea">
          <view v-for="(item, index) in filterWords.area" :key="index"
            :class="'tui-attr-item ' + (item.selected ? 'tui-attrItem-active' : '')" :data-index="index"
            @tap.stop="filterArea">
            <view class="tui-attr-ellipsis">{{ item.filterWord }}</view>
          </view>
        </view>
        <view class="tui-drawer-title" v-if="showLandlord">
          <text class="tui-title-bold">房东</text>
          <view class="tui-all-box"></view>
        </view>
        <view class="tui-drawer-content tui-flex-attr" v-if="showLandlord">
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
          <view class="tui-drawer-btn tui-drawerbtn-blue text-blue" hover-class="tui-white-hover" hover-stay-time="150"
            @tap="reset">重置</view>
          <view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-blue-hover" hover-stay-time="150"
            @tap="drawerSure">确定</view>
        </view>
      </view>

    </view>

  </tui-drawer>

</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      },
      filter: {
        type: Object,
        defalut: {}
      },
      showRent: {
        type: Boolean,
        default: true
      },
      showState: {
        type: Boolean,
        default: true
      },
      showSubways: {
        type: Boolean,
        default: true
      },
      showTags: {
        type: Boolean,
        default: true
      },
      showFloor: {
        type: Boolean,
        default: true
      },
      showArea: {
        type: Boolean,
        default: true
      },
      showLandlord: {
        type: Boolean,
        default: true
      },

    },
    data() {
      return {

        height: 64,
        drawerH: 0,
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
        s_filter: {
          rent: {},
          isRented: [false],
        },
        attrData: [],

      }
    },
    methods: {
      // screen(e) {
      // 	let index = e.currentTarget.dataset.index;
      // 	this.btnCloseDrop();
      // 	if (index == 0) {
      // 		this.showDropdownList();
      // 	} else if (index == 1) {
      // 		// 管理列表变化
      // 		this.showSlide = !this.showSlide;
      // 	} else if (index == 2) {
      // 		this.drawer = true;
      // 	}
      // },
      closeDrawer: function() {
        // this.drawer = false;
        this.$emit('close')
        console.log(this.show)
      },
      emptyRent() {
        this.house_filter.rent = {
          gte: "",
          lte: "",
        };
        delete this.s_filter.rent;
        this.resetRent();
        console.log(this.s_filter.rent);
      },
      drawerSure() {
        this.page = 0;
        this.houseList = [];
        // this.goTop();
        // this.getSearchLists(this.page);
        this.drawer = false;
        this.dropScreenShow = false;
        this.$emit('close');
        this.$emit('sure', this.s_filter);
      },
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
      filterSubways(e) {
        // console.log(e.currentTarget.dataset)
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
      reset() {

        this.s_filter = uni.getStorageSync("s_filter");
        this.filterWords = uni.getStorageSync("filterWords");
        this.house_filter = uni.getStorageSync("house_filter");
      },
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
    },
    created: async function(options) {
      console.log(this.filterWords)
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
          //略小，避免误差带来的影响
          this.dropScreenH = (this.height * 750) / res.windowWidth + 186;
          this.drawerH = res.windowHeight - uni.upx2px(100) - this.height;
        },
      });
      this.filterWords = this.filter
      uni.setStorageSync("s_filter", this.s_filter);
      uni.setStorageSync("house_filter", this.house_filter);
      uni.setStorageSync("filterWords", this.filterWords);
    }
  }
</script>

<style lang="less">
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

  .badge {
    // background-color: white !important;
    // color: var(--themeColor) !important;
    // border: var(--themeColor) solid 1rpx;
    // font-size: 18rpx !important;
    // border-color: var(--themeColor) !important;
    z-index: 999 !important;
  }
</style>
