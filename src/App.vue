<template>
  <div id="app">
    <h1>Прогнозирование данных</h1>
    <DataInput @data-submitted="handleDataSubmitted" />
    <ForecastResult v-if="chartData" />
    <TheorySource />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useStore } from '@/stores/store.js'
import DataInput from './components/DataInput.vue'
import ForecastResult from './components/ForecastResult.vue'
import TheorySource from './components/TheorySources.vue'

const chartData = ref(null)
const userStore = useStore()

const handleDataSubmitted = async () => {
  console.log('form submitted!')

  const requestData = {
    method: userStore.method,
    data: userStore.inputData,
    forecast_steps: 5,
  }
  console.log(requestData)

  try {
    const response = await axios.post('http://localhost:5000/forecast', requestData)
    chartData.value = response.data.forecast
    userStore.setChartData(chartData.value)
  } catch (error) {
    console.error('Ошибка при запросе данных:', error)
  }
}
</script>

<style>
#app {
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  border-radius: 10px;
}

header {
  background-color: #007bff;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

h1 {
  margin: 0 0 30px 0;
  text-align: center;
}

nav {
  margin-top: 10px;
}

nav a {
  color: white;
  margin: 0 15px;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}

main {
  margin-top: 20px;
}
</style>
