<template>
  <view>
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">房源反馈</view>
    </cu-custom>

    <tui-skeleton v-if="skeletonShow" :loadingType='7'></tui-skeleton>
    <view class="tui-skeleton">
      <view class="house tui-skeleton-fillet" style="">
        <house v-if="house.title" :house="house" :shadow="false" :radius="false" :radiusImg="true"></house>
      </view>

      <view class="problemFeedback padding-sm text-center ">
        <block v-for="(item,index) in problemText" :key="index">
          <view
            :class="['tui-skeleton-fillet problem-text', 'margin-bottom' ,'text-center','flex','flex-direction',(feedbackIndex==index?'problem-select':'')]"
            @click="problemFeedback" :data-name="item.name" :data-index="index">
            <span :class="['iconfont','text-grey','margin-xs',item.icon,(feedbackIndex==index?'text-white':'')]"></span>
            <view>{{item.name}}</view>

          </view>
        </block>
      </view>

      <view class="padding action">
        <view class="text-bold text-sm ">
          <text class="tui-skeleton-fillet">我要反馈</text>
        </view>
        <view class="cu-form-group margin-top bg-gray radius tui-skeleton-fillet">
          <textarea placeholder-class="text-sm text-gray " placeholder="你想说点什么？" maxlength="-1"></textarea>
        </view>
      </view>

      <!-- 		<view class="contact padding action">
			<view class="contact-title padding-tb">
				<text class="text-bold text-sm">联系方式</text>
			</view>
			<view class="radius bg-gray padding-sm">
				<input placeholder-class="text-xs text-gray" placeholder="请输入任意一个联系方式" />
			</view>
		</view>
 -->

      <view class="">
        <button type="primary" @click="submit" class="text-xs margin tui-skeleton-fillet">提交</button>
      </view>
      <tui-modal :show="modal" content="请选择反馈类型" :button="button" color="#333" :size="32" @click="cancel">
      </tui-modal>
    </view>
  </view>
</template>

<script>
  import house from '@/components/house/house.vue'
  components: {
    house
  }
  export default {
    data() {
      return {
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
        problemText: [{
            name: '图片错误',
            icon: "icon-cuowu"
          },
          {
            name: '图片过期',
            icon: "icon-guoqi1"
          },
          {
            name: '图片不符',
            icon: "icon-bufuhe1"
          },
          {
            name: '地址错误',
            icon: "icon-dizhi"
          },
          {
            name: '价格错误',
            icon: "icon-emijiage"
          },
          {
            name: '房态错误',
            icon: "icon-fangtaiguanli"
          }
        ],
        feedbackProblem: "",
        feedbackIndex: null,
        modal: false,
        button: [{
          text: "确定",
          type: "primary",
          plain: false
        }],
        skeletonShow: true
      }

    },
    methods: {
      problemFeedback(e) {
        let name = e.currentTarget.dataset.name
        let index = e.currentTarget.dataset.index
        this.feedbackProblem = name;
        this.feedbackIndex = index
        // console.log(this.feedbackProblem, this.feedbackIndex);
      },
      submit() {
        if (this.feedbackProblem) {
          console.log(this.feedbackProblem)
          uni.showToast({
            title: '尚未提交',
            icon: "none"
          });
          setTimeout(function() {
            uni.hideToast()
          }, 3000)
        } else {
          this.modal = true

        }

      },
      cancel(e) {
        // console.log(e)
        this.modal = false
      }


    },
    onLoad(params) {
      let houseId = params.houseId || "ad019c3885994991bbf11d247db0a124"
      this.http
        .get("/house/detail", {
          data: {
            houseId: houseId,
          },
        })
        .then((res) => {
          this.skeletonShow = false
          console.log(res.data)
          if (res.data.imgUrl) {
            this.house = res.data
          }
        })
    }
  }
</script>

<style scoped>
  /* @import url("https://at.alicdn.com/t/font_3183271_rmvhno5374c.css"); */

  .house {
    display: flex;
    height: 220rpx;
    margin: 10rpx 20rpx;
  }

  .problemFeedback {
    width: 100%;
    position: relative;

  }

  .problem-text {
    vertical-align: middle;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0upx 10upx;
    width: 180rpx;
    height: 130rpx;
    white-space: nowrap;
    border-radius: 12rpx;
    margin: 16rpx;
    background-color: #f0f0f0;
    color: #8799a3;
  }

  .problem-select {
    background-color: #0081ff;
    color: #ffffff;
  }

  .radius {
    border-radius: 10rpx;
  }
</style>
