import Vue from 'vue'
import App from './App'
import store from './store/store.js'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
    ...App,
	store
})
app.$mount()
