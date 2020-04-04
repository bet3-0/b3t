import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePageComponent from './components/HomePageComponent'
import LoginComponent from "./components/LoginComponent"
import App from './App.vue'


Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
      {
        path: '/',
        component: HomePageComponent
      },
      {
        path: '/login',
        component: LoginComponent
      },
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
