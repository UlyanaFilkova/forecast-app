// store.js
import { defineStore } from 'pinia'

export const useStore = defineStore('userData', {
  state: () => ({
    inputData: '',
    labels: [],
    method: 'method1',
  }),
  actions: {
    setData(data) {
      this.inputData = data
    },
    setLabels(labels) {
      this.labels = labels
    },
  },
})
