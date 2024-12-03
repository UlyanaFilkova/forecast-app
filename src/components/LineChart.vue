<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
)

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    historicalData: {
      type: Array,
      required: true,
    },
    forecastData: {
      type: Array,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
  },
  computed: {
    chartData() {
      const historicalLabels = this.historicalData.map((_, index) => `Месяц ${index + 1}`)
      const forecastLabels = this.forecastData.map(
        (_, index) => `Месяц ${this.historicalData.length + index + 1}`,
      )
      const allLabels = [...historicalLabels, ...forecastLabels]

      const lastHistoricalValue = this.historicalData[this.historicalData.length - 1]
      const forecastDataWithLastHistorical = [lastHistoricalValue, ...this.forecastData]

      return {
        labels: allLabels,
        datasets: [
          {
            label: 'Исторические данные',
            backgroundColor: 'rgba(66, 165, 245, 0.5)',
            borderColor: '#42A5F5',
            fill: true,
            data: this.historicalData,
          },
          {
            label: 'Прогноз',
            backgroundColor: 'rgba(255, 167, 38, 0.5)',
            borderColor: '#FFA726',
            fill: true,
            data: Array(this.historicalData.length - 1)
              .fill(null)
              .concat(forecastDataWithLastHistorical),
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px; /* Установите нужную высоту для графика */
}
</style>
