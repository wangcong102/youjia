<template>

  <!--商品列表-->
  <view>
    <view :class="['house',radius?'radius':'',shadow?'shadow':'']" hover-class="hover" hover-start-time="150">
      <img :class="['house-img', radiusImg?'radius':'']" v-if="showImg"
        :src="house.imgUrl[0]? house.imgUrl[0]+'?x-oss-process=style/index_preview' : 'https://uhome-cloud.oss-cn-shenzhen.aliyuncs.com/static/image/no_house_image.png' "
        mode="aspectFill" />
      <view class="house-right padding-left-sm">
        <view class="house-title" v-if="showTitle">
          <text v-if="house.isTop" class="cuIcon-appreciatefill text-themeColor"></text>{{ house.title }}
        </view>
        <view class="house-title-text">
          <block v-if="house.houseType.rooms==1&amp;house.houseType.halls==0">
            <view>
              <span>{{ house.houseNum }}室 • </span>
              <span>单间 • </span>
              <span>{{ house.area }} m² • </span>
              <span>楼{{ house.floor.atFloor }}/{{ house.floor.totalFloor }}</span>
            </view>
          </block>
          <block v-else="">
            <view>
              <span>{{ house.houseNum }}室 • </span>
              <span>{{ house.houseType.rooms }}房{{house.houseType.halls}}厅{{ house.houseType.toilets }}卫 • </span>
              <span>{{ house.area }}m² • </span>
              <span>楼{{ house.floor.atFloor }}/{{ house.floor.totalFloor }}</span>
            </view>
          </block>
        </view>
        <view class="house-tags">
          <view class="" v-if="showTag">
            <view class="house-tag bg-grey light " v-for="(house1, index1) in house.tags" :key="index1">
              {{ house1 }}
            </view>
          </view>
        </view>
        <view class="house-rent" v-if="showRent">
          <text>{{ house.rent }}</text>
          <text class="house-rent-text">元/月</text>
        </view>
        <view class="check-icon" v-if="house.checked">
          <span class="iconfont icon-youshangjiaoicon1 text-blue"></span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      house: {
        type: Object,
        required: true,
      },
      showTitle: {
        type: Boolean,
        default: true,
      },
      showImg: {
        type: Boolean,
        default: true,
      },
      showTag: {
        type: Boolean,
        default: true,
      },
      showRent: {
        type: Boolean,
        default: true,
      },
      radius: {
        type: Boolean,
        default: true,
      },
      shadow: {
        type: Boolean,
        default: true,
      },
      radiusImg: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // title: this.title
      };
    },
  };
</script>

<style lang="less">
  .radius {
    border-radius: 25rpx;
  }

  .shadow {
    box-shadow: 2rpx 2rpx 10rpx 4rpx #d3d3d3ce;
  }

  .house {
    position: relative;
    width: calc(100% - 40rpx);
    height: 200rpx;
    overflow: hidden;
    // background-color: yellow;
    display: flex;
    flex-direction: row;
    margin: 10rpx 20rpx;

    img.house-img {
      width: 260rpx;
      min-width: 260rpx;
      height: 100%;
    }

    .house-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;

      .house-isTop {}

      .house-title {
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-weight: 500;
        font-size: 35rpx;
      }

      .house-title-text {
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-break: break-all;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        color: #8799a3;
        font-size: 24rpx;
      }

      .house-tags {
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-break: break-all;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        .house-tag {
          font-size: 24upx;
          vertical-align: middle;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding: 0upx 10upx;
          height: 48upx;
          font-family: Helvetica Neue, Helvetica, sans-serif;
          white-space: nowrap;
          border-radius: 12rpx;
          margin-right: 10rpx;
        }
      }

      .house-rent {
        font-size: 36rpx;
        font-weight: 600;
        letter-spacing: 1rpx;
        color: var(--themeColor);

        .house-rent-text {
          font-size: 26rpx;
          font-weight: 400;
          text-shadow: 1rpx 1rpx 5rpx rgba(0, 129, 255, 0.2);
        }
      }
    }

    .check-icon {
      width: 60rpx;
      height: 60rpx;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 9;
      text-shadow: -6upx 6upx 8upx rgba(0, 102, 204, 0.2);

      span {
        top: 0;
        right: 0;
        position: absolute;
        font-size: 60rpx;
      }
    }
  }
</style>
