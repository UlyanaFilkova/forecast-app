import { createRouter, createWebHistory } from 'vue-router'
import TheorySources from '@/components/TheorySources.vue'
import DataInput from '@/components/DataInput.vue'
import ForecastResult from '@/components/ForecastResult.vue'

const routes = [
  { path: '/', component: DataInput },
  { path: '/theory', component: TheorySources },
  { path: '/results', component: ForecastResult },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
