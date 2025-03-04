import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useStore = defineStore('userData', () => {
  const inputData = ref([])
  const chartData = ref([])
  const labels = ref([])

  function setData(data) {
    inputData.value = data
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
    setData,
    setLabels,
    setChartData,
  }
})
