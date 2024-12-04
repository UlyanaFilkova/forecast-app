// store.js
import { defineStore } from 'pinia';

export const useStore = defineStore('userData', {
  state: () => ({
    inputData: '',
    url: '',
    method: 'method1',
  }),
  actions: {
    setData(data) {
      this.inputData = data.inputData;
      this.url = data.url;
      this.method = data.method;
    },
  },
});