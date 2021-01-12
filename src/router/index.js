import { createRouter, createWebHistory } from 'vue-router'

export const ROLE_USER = 'ROLE_USER'
export const ROLE_ADMIN = 'ROLE_ADMIN'

const routes = [
  {
    path: '/any',
    name: 'any',
    component: () => import('../views/Any.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/User.vue'),
    meta: {
      roles: [ROLE_USER]
    },
    redirect: '/welcome',
    children:[
      {path:'/welcome',component:() => import('../components/Welcome.vue')},
      {path:'/availablejobs',component:() => import('../components/AvailableJobs.vue')},
      {path:'/myreward',component:() => import('../components/MyReward.vue')},
      {path:'/rewardrank',component:() => import('../components/RewardRank.vue')},
      {path:'/workhistory',component:() => import('../components/WorkHistory.vue')},
      {path:'/infoedit',component:() => import('../components/InfoEdit.vue')},
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      roles: [ROLE_ADMIN]
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
