import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/setOne',
    name: 'setUp',
    component: () => import('../views/setUp/setOne.vue')
  },
  {
    path: '/setTwo',
    name: 'setTwo',
    component: () => import('../views/setUp/setTwo.vue')
  },
  {
    path: '/setThree',
    name: 'setThree',
    component: () => import('../views/setUp/setThree.vue')
  },

  {
    path: '/contentControl',
    name: 'contentControl',
    component: () => import('../views/contentControl/contentControl.vue')
  },
  {
    path: '/volumeControl',
    name: 'volumeControl',
    component: () => import('../views/volumeControl/volumeControl.vue')
  },
  {
    path: '/envirControl',
    name: 'envirControl',
    component: () => import('../views/envirControl/envirControl.vue')
  },
  {
    path: '/equipControl',
    name: 'equipControl',
    component: () => import('../views/equipControl/equipControl.vue')
  },
  {
    path: '/playbackControl',
    name: 'playbackControl',
    component: () => import('../views/playbackControl/playbackControl.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
