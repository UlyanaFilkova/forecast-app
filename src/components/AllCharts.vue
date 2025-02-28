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
    forecastDataCount: {
      type: Number,
      required: true,
      default: 4,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
  },
  computed: {
    chartData() {
      const historicalLabels = this.historicalData.map((_, index) => `${index + 1}`)
      const forecastLabels = this.forecastDataCount > 0 ? Array(this.forecastDataCount).fill(0).map((_, idx) => `${this.historicalData.length + idx + 1}`) : []

      const lastHistoricalValue = this.historicalData[this.historicalData.length - 1]

      const randomForecasts = Array.from({ length: this.forecastDataCount }, () =>
        Array(this.historicalData.length - 1).fill(null).concat(lastHistoricalValue).concat(
          Array(this.forecastDataCount).fill(0).map(() => Math.floor(Math.random() * 100) + 50)
        )
      )

      return {
        labels: [...historicalLabels, ...forecastLabels],
        datasets: [
          {
            label: 'Исторические данные',
            backgroundColor: 'rgba(66, 165, 245, 0.5)',
            borderColor: '#42A5F5',
            fill: true,
            data: this.historicalData,
            yAxisID: 'y',
          },
          ...randomForecasts.map((forecast, idx) => ({
            label: `Прогноз ${idx + 1}`,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, // случайный цвет для каждой линии
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            fill: true,
            data: forecast,
            yAxisID: 'y',
          }))
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'Прогнозирование нескольких линий',
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
        },
      }
    }
  },
  watch: {
    historicalData() {
      this.$refs.chart.update()
    }
  },
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
