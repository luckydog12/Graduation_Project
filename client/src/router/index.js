import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

//解决路由push方法没加回调时的报错
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    redirect: {name: 'Login'}
  }, {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
  }, {
    path: '/register',
    name: 'Register',
    component: () => import('../views/login/Register.vue'),
  }, {
    path: '/temp',
    name: 'Temp',
    component: () => import('../views/login/Temp.vue'),
  }, {
    path: '/common/aBulletin',
    name: 'CommonBulletin',
    component: () => import('views/common/aBulletin.vue') 
  }, {
    path: '/index',
    name: 'Index',
    component: () => import('../views/layout/index.vue'),
    children: [{
      path: '/personal',
      name: '个人中心',
      component: () => import('views/personal.vue')
    }]
  }, 
]

const routeInfoOwner = [{
  path: '/layout',
  name: 'Layout',
  component: () => import('views/layout/index.vue'),
  children: [{
    path: '/home',
    name: '首页',
    component: () => import('views/owner/home.vue')
  }, {
      path: '/bulletin',
      name: '查看公告',
      component: () => import('views/owner/bulletin')
  }, {
    path: '/complaint',
    name: '我的投诉',
    component: () => import('views/owner/complaint')
  }, {
    path: '/service',
    name: '我的报修',
    component: () => import('views/owner/service')
  }, {
    path: '/payment',
    name: '我的账单',
    component: () => import('views/owner/payment')
  }]
}]

const routeInfoAdmin =[{
  path: '/layout',
  name: 'Layout',
  component: () => import('views/layout/index.vue') ,
  children: [{
    path: '/home',
    name: '首页',
    component: () => import('views/admin/home/home.vue')
  }, {
      path: "/houseSys/building",
      name: "楼栋管理",
      component: () => import('views/admin/house/building.vue') 
  }, {
      path: "/houseSys/house",
      name: "房屋管理",
      component: () => import('views/admin/house/house.vue') 
  }, {
      path: '/parkingSys/parking',
      name: '车位管理',
      component: () => import('views/admin/parking/parking.vue')
  }, {
      path: '/paymentSys/payManage',
      name: '缴费管理',
      component: () => import('views/admin/payment/payManage.vue')   
  }, {
        path: '/communitySys/bulletin',
        name: '公告管理',
        component: () => import('views/admin/community/bulletin.vue') 
  }, {
        path: '/communitySys/service',
        name: '维修管理',
        component: () => import('views/admin/community/service.vue'),
        alias: '/communitySys/complaint'
  },
  // {
  //       path: '/communitySys/complaint',
  //       name: '投诉管理',
  //       component: () => import('views/admin/community/complaint.vue') 
  // }, 
  {
        path: '/userSys/user',
        name: '用户管理',
        component: () => import('views/admin/user/admin.vue') 
  }]
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if( !token && to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Temp') {
    next({ name: 'Login' })
  } else if (!token && to.name === 'Login') {
    next()
  } else {
    if( !to.name && store.state.user.routeInfo ) {
      if(store.state.user.identity === 1) {
        router.addRoutes(routeInfoAdmin)
      } else {
        router.addRoutes(routeInfoOwner)
      }
      next({ ...to, replace: true })
    } else {
      next()
    }
  }
})


export default router
