<template>
  <view class="tui-set-box">
    <cu-custom bgColor="bg-blue" :isCustom="true">
      <block slot="backText">返回</block>
      <view slot="content">授权管理</view>
    </cu-custom>
    <view class="padding"></view>
    <tui-card border :header="{  bgcolor: 'rgba(0, 129, 255, .7)',   line: false }"
      :image="{  url: userInfo.avatar_url,   height: 60,   width: 60,   circle: false }"
      :title="{  text: '未设置实名',   size: 30,   color:'#fff'}"
      :tag="{ text:utils.role2Text(userInfo.role),  size: 24, color: '#eee' }">
      <template v-slot:body>
        <view class="padding bg-blue-70">
          <view class="padding-top">姓名：{{userInfo.realName?userInfo.realName:"未设置实名"}}</view>
          <view class="padding-tb-xs">号码：{{userInfo.phone}}</view>
          <view class="padding-bottom">
            <span>该用户授权为</span>
            <span class="text-bold text-shadow margin-left-xs">
              {{utils.role2Text(userInfo.role)}}</span>
          </view>
        </view>
      </template>
      <template v-slot:footer>
        <view class="padding ">
          <tui-list-cell arrow unlined padding="0" @click="showAuthActionSheet = true" :hover="false">
            更改授权
          </tui-list-cell>
        </view>
      </template>
    </tui-card>
    <tui-actionsheet tips="切换授权" :show="showAuthActionSheet" :item-list="authItemList" @click="swtichAuth"
      @cancel="closeAuthActionSheet">
    </tui-actionsheet>
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
        loadingText: '加载中...',
        tipsColor: 'warning',
        tipsPosition: 'top',
        userInfo: {
          id: '',
          uuid: '',
          uuid: '',
          realName: '',
          nickname: '',
          role: 'member',
          gender: 3,
          avatar_url: '',
          username: '',
          phone: '',
          qq: '',
          wechat: '',
          email: '',
          base_salary: '',
          payQrcode: '',
        },
        showAuthActionSheet: false,
        authItemList: [{
            text: '管理员',
            color: '#2B2B2B',
            role: 'boss',
          },
          {
            text: '店长',
            color: '#2B2B2B',
            role: 'manager',
          },
          {
            text: '职员',
            color: '#2B2B2B',
            role: 'staff_member',
          },
          {
            text: '办理离职',
            color: '#999',
            role: 'member',
          },
        ],
      };
    },
    onLoad(options) {
      const staff_uid = options.staff_uid || 'cfd9ba78-cc8f-4466-9d4c-d0844bc22083';
      this.getUserInfo(staff_uid);
    },
    onShow() {},
    methods: {
      async getUserInfo(staff_uid) {
        this.loadingCpt(true);
        console.log(staff_uid);
        await this.http
          .get('/staff/info', {
            data: {
              staff_uid: staff_uid,
            },
          })
          .then((res) => {
            if (res.code != 200) {
              uni.showToast({
                title: res.msg,
                icon: 'none',
              });
            } else {
              res.data.base_salary = String(res.data.base_salary);
              this.userInfo = res.data;
            }
            return res.data;
          });
        this.loadingCpt(false);
      },
      async swtichAuth(e) {
        console.log(e);
        this.loadingCpt(true);
        this.showAuthActionSheet = false;
        await this.http
          .post('/user/auth/alter', {
            data: {
              staff_uid: this.userInfo.staff_uid,
              role: e.role,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              res.data.base_salary = String(res.data.base_salary);
              this.userInfo = res.data;
              this.showTips(res.msg, 'success', 'center');
            } else {
              this.showTips(res.msg, 'warning', 'center');
            }
            if (e.role == 'member') {
              uni.navigateBack({
                delta: 1,
              });
            }
          });
        this.loadingCpt(false);
      },

      closeAuthActionSheet() {
        this.showAuthActionSheet = false;
      },
      // 通用组件调用v0.3
      showTips: function(
        msg = '成功',
        type,
        position = 'center',
        duration = 1500,
      ) {
        this.tipsColor = this.utils.text2Color(type);
        this.tipsPosition = position;
        this.$refs[`tips${position}`].showTips({
          msg: msg,
          duration: duration,
        });
      },
      loadingCpt: function(operate = false, loadingText = '加载中...') {
        this.showloading = operate;
        this.loadingText = loadingText;
      },
    },
  };
</script>

<style scoped>
  .tui-set-box {
    padding-bottom: 20rpx;
    color: #333;
  }
</style>
