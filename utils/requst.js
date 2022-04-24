
// let baseURL = "http://127.0.0.1:8000/api";
// let timeout = 30000;
// let token = uni.getStorageSync('token');
// // 退出登录
// function logout() {
//   //清除所有缓存
//   // uni.clearStorage();
//   uni.showToast({
//     title: '登录过期',
//     icon: 'error',
//     mask: true,
//   })
//   // 显示提示
//   setTimeout(() => {
//     // 1.5s后跳转到登录界面
//     uni.redirectTo({
//       url: '/pages/login/login'
//     });
//   }, 1500);
// }

// export const post = (params) => {

//   if (params.url[0] == '/') {
//     params.url = baseURL + params.url
//   }
//   return new Promise((resolve, reject) => {
//     uni.request({
//       ...params,
//       datatype: "json",
//       method: 'POST',
//       header: {
//         'Authorization': token,
//         "content-type": "application/json",
//       },
//       timeout: timeout,
//       success: (result) => {
//         // code 4xxx鉴权失败 前端登出
//         let code = result.data.code
//         if (code >= 41000 && code <= 50000) {
//           logout()
//         }
//         resolve(result.data);
//       },
//       fail: (err) => {
//         console.log('网络连接不稳定')
//         uni.showToast({
//           title: "网络连接不稳定",
//           icon: 'error',
//           mask: true
//         })
//         reject(err);
//       },

//     });
//   })
// }



// export const get = (params) => {
//   if (params.url[0] == '/') {
//     params.url = baseURL + params.url
//   }
//   return new Promise((resolve, reject) => {
//     uni.request({
//       ...params,
//       datatype: "json",
//       method: 'GET',
//       header: {
//         'Authorization': token,
//         "content-type": "application/json",
//       },
//       timeout: timeout,
//       success: (result) => {
//         // code 4xxx鉴权失败 前端登出
//         let code = result.data.code
//         if (code >= 41000 && code <= 50000) {
//           logout()
//         }
//         resolve(result.data);
//       },
//       fail: (err) => {
//         console.log('网络连接不稳定')
//         uni.showToast({
//           title: "网络连接不稳定",
//           icon: 'error',
//           mask: true
//         })
//         reject(err);
//       },
//     });
//   })
// }
