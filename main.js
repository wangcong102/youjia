import Vue from 'vue'
import App from './App'
import store from './store'
import tui from './common/httpRequest'
import utils from "./utils/util"
import Md5 from 'js-md5'
Vue.config.productionTip = false

// #ifdef H5
window.QQmap = null;
// #endif

// #ifndef MP-TOUTIAO
//网络监听
setTimeout(() => {
	uni.onNetworkStatusChange(function(res) {
		//console.log(res.networkType);
		store.commit("networkChange", {
			isConnected: res.isConnected
		})
	});
}, 1000)
// #endif

// ColorUI组件
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

import house from '@/components/house/house.vue'
Vue.component('house', house)



// ThorUI 组件
Vue.prototype.tui = tui
Vue.prototype.utils = utils
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$store = store
App.mpType = 'app'

// 引入MD5加密
Vue.prototype.$md5 = Md5

// http请求
import http from './components/common/tui-request'

var baseUrl = ""
if (process.env.NODE_ENV === "development") {
	console.log("开发环境");
	// 本地服务地址
	baseUrl = "http://127.0.0.1:8000/api"
	// 测试地址
	// baseUrl = "https://test.findahouse.cn/api"
	// 线上地址
	// baseUrl = "https://home.l0o0l.cn/api"
} else {
	console.log("生产环境");
	// 测试地址
	// baseUrl = "https://test.findahouse.cn/api"
  // 模板地址
  // baseUrl = "https://temp.findahouse.cn/api"
	// 线上地址
	baseUrl = "https://home.l0o0l.cn/api"
}

//初始化请求配置项
http.create({
	host: baseUrl,
	header: {
		'content-type': 'application/json'
	}
})
//请求拦截
http.interceptors.request.use(config => {
	let token = uni.getStorageSync('token');
	if (config.header) {
		config.header['Authorization'] = token
	} else {
		config.header = {
			'Authorization': token
		}
	}
	return config
})
//响应拦截
http.interceptors.response.use(response => {
	let code = response.code
	if (code >= 41000 && code <= 50000) {
		uni.showToast({
			title: '正在跳转',
			icon: 'error',
			mask: true,
		})
		// 显示提示
		setTimeout(() => {
			// 1.5s后跳转到登录界面
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}, 1500);
	}
	//TODO
	return response
})

Vue.prototype.http = http



const app = new Vue({
	store,
	...App
})
app.$mount()
