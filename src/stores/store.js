// store.js
import { defineStore } from 'pinia'

export const useStore = defineStore('userData', {
  state: () => ({
    inputData: '',
    labels: [],
    method: '',
  }),
  actions: {
    setData(data) {
      this.inputData = data
    },
    setMethod(method) {
      this.method = method
    },
    setLabels(labels) {
      this.labels = labels
    },
  },
})
