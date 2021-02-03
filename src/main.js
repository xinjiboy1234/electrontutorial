import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import router from '@/router/router'
import './element-variables.scss'

Vue.use(ElementUI);
Vue.use(VueRouter);
// import socketClient from '@/utils/socket' // socket 套接字通讯模块封装

Vue.config.productionTip = false
// Vue.prototype.socketClient = socketClient // 注册成全局公共工具类

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
