import Vue from 'vue'
import Router from 'vue-router'
import Project from '@/components/project/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'project',
      component: Project
    },
  ]
})
