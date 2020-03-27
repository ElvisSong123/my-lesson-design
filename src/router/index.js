import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/index.vue'
import axios from '@/toolsFunc/axios.js'
Vue.use(VueRouter)
let sessionId = document.cookie.split(';');
    sessionId = sessionId.filter((ele) => {
      return ele.includes('status');
  })
sessionId = sessionId[0] && sessionId[0].split('=')[1].trim()
let direct = '';
console.log(sessionId,'status123')
if(sessionId == '管理员'){
  direct = '/userInfo'
}else if(sessionId == '学生'){
  direct = '/myResume/viewResume'
}else if(sessionId == '企业用户'){
  direct = '/addCompanyInfo'
}else{
  direct = '/addCompanyInfo'
}

let routeProtect = (sessionId,nowStatus)=>{
  return (to,from,next)=>{
    if(sessionId == nowStatus){
      next();
    }else{
      location.href = '/'
    }
  }
}

const routes = [{
  path: '/',
  name: 'home',
  component: Home,
  redirect: direct,
  children: [
    {
      path: 'myResume',
      name: 'myResume',
      component: () => import('@/views/MyResume/index.vue'),
      beforeEnter:routeProtect(sessionId,'学生'),
      // redirect: '/myResume/addResume',
      children: [
      {
        path: 'addResume',
        name: 'addResume',
        component: () => import('@/views/MyResume/component/addResume.vue')
      },
      {
        path: 'viewResume',
        name: 'viewResume',
        component: () => import('@/views/MyResume/component/viewResume.vue')
      }]
    },
    {
      path: 'jobInfo',
      name: 'jobInfo',
      component: () => import('@/views/JobInfo/index.vue'),
      beforeEnter:routeProtect(sessionId,'学生'),
    },
    {
      path: 'recruitStatistic',
      name: 'recruitStatistic',
      component: () => import('@/views/RecruitStatistic/index.vue'),
      beforeEnter:routeProtect(sessionId,'学生'),
    },
    {
      path: 'deliveryFeedback',
      name: 'deliveryFeedback',
      component: () => import('@/views/DeliveryFeedback/index.vue'),
      beforeEnter:routeProtect(sessionId,'学生'),
    }, {
      path: 'addCompanyInfo',
      name: 'addCompanyInfo',
      component: () => import('@/views/addCompanyInfo/index.vue'),
      beforeEnter:routeProtect(sessionId,'企业用户'),
    }, {
      path: 'addJobInfo',
      name: 'addJobInfo',
      component: () => import('@/views/addJobInfo/index.vue'),
      beforeEnter:routeProtect(sessionId,'企业用户'),
    }, {
      path: 'userInfo',
      name: 'userInfo',
      component: () => import('@/views/userInfo/index.vue'),
      beforeEnter:routeProtect(sessionId,'管理员'),
    }, {
      path: 'userApply',
      name: 'userApply',
      component: () => import('@/views/userApply/index.vue'),
      beforeEnter:routeProtect(sessionId,'管理员'),
    }

  ]
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/Login/index.vue')
},
{
  path: '/register',
  name: 'register',
  component: () => import('@/views/Register/index.vue')
}, {
  path: '/applyCount',
  name: 'applyCount',
  component: () => import('@/views/applyCount/index.vue')
},{
  path:'*',
  component: () => import('@/views/404page/index.vue')
}]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {//添加导航守卫
  if (to.path == '/login' || to.path == '/applyCount') {
    next();
  } else {
    let sessionId = document.cookie.split(';');
    sessionId = sessionId.filter((ele) => {
      return ele.includes('sessionId');
    })
    sessionId = sessionId[0] && sessionId[0].split('=')[1].trim()
    axios({
      method: 'post',
      url: 'judgeLogin',
      data: {
        session: sessionId,
      }
    }).then((res) => {
      if (res) {
        next()
      } else {
        Vue.prototype.$message.error('您还没有权限，请先登录');
        setTimeout(() => {
          location.href = '/login'

        }, 1000);
      }
    }, (err) => {

    })

  }

});

export default router