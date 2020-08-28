import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import './theme/element/index.css'
// 引用websocket
import * as socketApi from './api/socket.js'
Vue.prototype.socketApi = socketApi
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
