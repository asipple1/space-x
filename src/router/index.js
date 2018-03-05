import Vue from 'vue'
import Router from 'vue-router'
import Space from '@/components/space_x'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'space',
      component: Space
    }
  ]
})
