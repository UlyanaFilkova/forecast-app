<template>
  <div id="app">
    <h1>Прогнозирование данных</h1>
    <DataInput @data-submitted="handleDataSubmitted" />
    <ForecastChart />
    <!-- <ForecastChart v-if="chartData" :data="chartData" /> -->
    <Theory />
  </div>
</template>

<script>
import DataInput from './components/DataInput.vue'
import ForecastChart from './components/ForecastResult.vue'
import Theory from './components/TheorySources.vue'

export default {
  components: {
    DataInput,
    ForecastChart,
    Theory,
  },
  data() {
    return {
      chartData: null,
    }
  },
  methods: {
    async handleDataSubmitted(data) {
      // Отправка данных на сервер для прогнозирования
      const response = await this.$http.post('http://localhost:5000/predict', data)
      this.chartData = response.data
    },
  },
}
</script>

<style>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

header {
  background-color: #007bff;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

h1 {
  margin: 0;
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
