<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    historicalData: Array,
    forecastData: Array,
    chartOptions: Object,
  },
  computed: {
    chartData() {
      const historicalLabels = this.historicalData.map((_, index) => `Месяц ${index + 1}`)
      console.log(this.historicalData.length)
      const forecastLabels = this.forecastData.map(
        (_, index) => `Месяц ${this.historicalData.length + index + 1}`,
      )
      const allLabels = [...historicalLabels, ...forecastLabels]

      return {
        labels: allLabels,
        datasets: [
          {
            label: 'Исторические данные',
            backgroundColor: '#42A5F5',
            data: this.historicalData,
          },
          {
            label: 'Прогноз',
            backgroundColor: '#FFA726',
            data: Array(this.historicalData.length).fill(null).concat(this.forecastData),
          },
        ],
      }
    },
  },
}
</script>
