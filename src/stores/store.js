import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useStore = defineStore('userData', () => {
  const inputData = ref([])
  const chartData = ref([])
  const labels = ref([])
  const method = ref('')

  function setData(data) {
    inputData.value = data
  }

  function setMethod(methodValue) {
    method.value = methodValue
  }

  function setLabels(labelsValue) {
    labels.value = labelsValue
  }

  function setChartData(data) {
    chartData.value = data
  }

  return {
    inputData,
    chartData,
    labels,
    method,
    setData,
    setMethod,
    setLabels,
    setChartData,
  }
})
