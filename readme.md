### 项目规范文件路径

```shell
├─colorui # colorui组件库
├─common # 存放项目共用的资源
├─components #项目共用的组件
├─libs #公共封装好的库
├─pages #uniapp 页面文件
├─static  # 纯静态资源
│  ├─iconfont #静态图标和字体
│  │  ├─font #静态字体
│  │  └─icon #静态图标
│  ├─image #静态公共图片
│  └─pages #静态页面图片
│      └─index #index页面下的图片文件
├─static_backup #静态文件备份，项目使用到的所有静态文件
├─store # vuex
├─unpackage # 存放所有打包生成后的文件
├─utils #自定义的工具类函数，是一个共享的方法
├─App.vue #应用配置，用来配置App全局样式以及监听应用的生命周期
├─main.js #Vue初始化入口文件
├─manifest.json #配置应用名称、appid、logo、版本等打包信息
├─pages.json #配置页面路由、导航条、选项卡等页面类信息
└─uni.scss #按钮颜色、边框风格，uni.scss文件里预置了一批css变量预置。
```

抛弃微信小程序原生开发，优家前端使用灵活性更高的uniapp开发，一套代码统一多端应用

目前预备发布平台

- [ ]  微信小程序
- [ ]  QQ小程序
- [ ]  安卓
- [ ]  iOS

使用的CSS框架ColorUI

使用的组件库ThorUI

前端request请求方法封装get() post()方法分别为调用发起get post请求方法

使用拦截器为请求发起之前添加authentication请求头携带token，用户鉴权

封装loading加载中提示框，和tips提示

- loading提示为在请求数据时显示的加载中…转圈圈部件。
- tips提示为在操作时操作反馈如：登录成功、收藏成功等等

前端样式主题色统一 使用全局主题色变量在写style的时可以统一使用变量进行设置

对短时间可能会经常触发同一事件进行防抖，对在连续触发的事件进行节流

防抖节流方法进行封装

### 区分开发环境和生产环境

uni-app 可通过 process.env.NODE_ENV 判断当前环境是开发环境还是生产环境。一般用于连接测试服务器或生产服务器的动态切换。

在main.js 中定义开发环境使用的baseUrl和生产环境使用的baseUrl

```jsx
if (process.env.NODE_ENV === "development") {
	console.log("开发环境");
} else {
	console.log("生产环境");
}
```

### **缩写**

前端变量多起来的时候，名命简直是一个折磨，比如底部导航按钮的索引变量应该怎么取，bottomNavigationButtonIndex？一个变量长度就有27位了简直疯了，这个时候就需要对一个固定的词语缩写了，比如bottom缩写成btm、navigation缩写成nav，最后 bottomNavigationButtonIndex缩写成btmNavbtnInd或把button省去仍然可以保留其意思，最终变成 btmNavInd 长度变为10位，大大缩短简化了变量名，

bottom → btm

navigation → nav

index→ idx

navigation → nav

message→ msg