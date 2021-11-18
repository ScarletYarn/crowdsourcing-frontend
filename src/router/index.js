import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

export const ROLE_USER = 'ROLE_USER'
export const ROLE_ADMIN = 'ROLE_ADMIN'

const routes = [
  {
    path: '/workpanel',
    name: 'workpanel',
    component: () => import('../views/WorkPanel.vue'),
    redirect: '/workdesc',
    children: [
      {
        path: '/workdesc1/:jobId',
        name: 'workdesc1',
        component: () => import('../components/work/workDesc1.vue'),
        props: true
      },
      {
        path: '/workdesc2/:jobId',
        name: 'workdesc2',
        component: () => import('../components/work/workDesc2.vue'),
        props: true
      },
      {
        path: '/questionnaire/:jobId',
        name: 'questionnaire',
        component: () => import('../components/work/questionnaire.vue'),
        props: true
      },
      {
        path: '/check/:jobId',
        name: 'check',
        component: () => import('../components/work/check.vue'),
        props: true
      },
      {
        path: '/workdo1/:jobId',
        name: 'workdo1',
        component: () => import('../components/work/workDo1.vue'),
        props: true
      },
      {
        path: '/workdo2/:jobId',
        name: 'workdo2',
        component: () => import('../components/work/workDo2.vue'),
        props: true
      },
      {
        path: '/questionOverall/:jobId',
        name: 'questionOverall',
        component: () => import('../components/work/questionOverall.vue'),
        props: true
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/User.vue'),
    meta: {
      roles: [ROLE_USER]
    },
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome.vue')
      },
      {
        path: '/availablejobs',
        component: () => import('../components/AvailableJobs.vue')
      },
      {
        path: '/myreward',
        component: () => import('../components/MyReward.vue')
      },
      {
        path: '/rewardrank',
        component: () => import('../components/RewardRank.vue')
      },
      {
        path: '/workhistory',
        component: () => import('../components/WorkHistory.vue')
      },
      {
        path: '/infoedit',
        component: () => import('../components/InfoEdit.vue')
      }
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
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/result/:id',
    name: 'result',
    component: () => import('../components/Result.vue'),
    props: true
  },
  {
    path: '/kb/home',
    name: 'kb',
    component: () => import('../components/KBPages/Home.vue')
  },
  {
    path: '/kb/entity/:entity',
    name: 'entity',
    component: () => import('../components/KBPages/Entity.vue'),
    props: true
  },
  {
    path: '/kb/relationship/:entity/:rel/:position',
    name: 'relationship',
    component: () => import('../components/KBPages/Relationship.vue'),
    props: true
  },
  {
    path: '/kb/ckqa',
    name: 'qa',
    component: () => import('../components/KBPages/QA.vue')
  },
  {
    path: '/kb/oie',
    name: 'oie',
    component: () => import('../components/KBPages/OIE.vue')
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
