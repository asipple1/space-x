import Vue from 'vue'
import Router from 'vue-router'
import Space from '@/components/space_x'
import Rocket from '@/components/rocket'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'space',
      component: Space
  },
  {
      path: '/:id',
      name: 'rocket',
      component: Rocket
  }
  ]
})
