<template>
  <div>
    <Line :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

// Регистрация компонентов Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

// Принимаем пропсы
const props = defineProps({
  historicalData: { type: Array, required: true },
  forecastData: { type: Array, required: true },
  chartOptions: { type: Object, required: true },
})

// Вычисляемые данные для графика
const chartData = computed(() => {
  const historicalLabels = props.historicalData.map((_, index) => `${index + 1}`)
  const forecastLabels = props.forecastData.map((_, index) => `${props.historicalData.length + index + 1}`)
  const allLabels = [...historicalLabels, ...forecastLabels]

  const lastHistoricalValue = props.historicalData[props.historicalData.length - 1]
  const forecastDataWithLastHistorical = [lastHistoricalValue, ...props.forecastData]

  return {
    labels: allLabels,
    datasets: [
      {
        label: 'Исторические данные',
        backgroundColor: 'rgba(66, 165, 245, 0.5)',
        borderColor: '#42A5F5',
        fill: true,
        data: props.historicalData,
      },
      {
        label: 'Прогноз',
        backgroundColor: 'rgba(255, 167, 38, 0.5)',
        borderColor: '#FFA726',
        fill: true,
        data: Array(props.historicalData.length - 1).fill(null).concat(forecastDataWithLastHistorical),
      },
    ],
  }
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
