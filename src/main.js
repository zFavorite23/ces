import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index"; // 全局过滤器
import "./role"; // 权限
import axios from 'axios'
// 将axios共享给所有实例使用
Vue.prototype.$axios = axios

import "./assets/icons/iconfont";
import IconSvg from "./components/common/IconSvg.vue"; // svg组件

import "../src/styles/common.css";
import "../src/assets/icons/iconfont.css";

import echarts from "echarts";
Vue.prototype.$echarts = echarts;

import 'video.js/dist/video-js.css'

import Print from "vue-print-nb";
Vue.use(Print);

// 复制功能
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
