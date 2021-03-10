import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import './assets/font/iconfont.css'
import './assets/font/iconfont.js'

import marked from 'marked'

import './assets/css/global.css'

import Message from './components/Message/index.js'

Vue.prototype.$message = Message  //注册提示信息模块

const instance1 = axios.create({
  baseURL:"https://back.dtfei.cn/"
})


//2.再创建一个axios实例，用来放第二个baseURL
const instance2 = axios.create({
  baseURL:"https://fapiao.looyeagee.cn/api/"
})


Vue.prototype.$http= instance1;

Vue.prototype.$http1 = instance2;



Vue.prototype.md2html = (md)=> {
  return marked(md || '')
}

//过滤器
instance1.interceptors.request.use(config=>{
  if(window.localStorage.getItem('token')){
	  config.headers.Authorization = "Bearer " + window.localStorage.getItem('token');
  }
  
  /*必须return config*/
  return config;
});



router.beforeEach(async (to, from, next) => {
  if(to.path === '/login' || to.path === '/register'){
    next();
  }else{
    if(window.localStorage.getItem('token')){
      next();
    }else{
      next('/login');
    }
  }
  if(to.path === '/addNotice' || to.path === '/pdf' || to.path === '/photo' || to.path === '/editUser' || to.path === '/editArticle'  || to.path === '/editNotice' ){
     const {data: res} = await instance1.post('user/isSuper');
     console.log(res);
     if(res.errno === 0){
       next(to);
     }else {
       next(from);
       Message.error("您不是管理员，您没有该权限")
     }
  }
})


Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
