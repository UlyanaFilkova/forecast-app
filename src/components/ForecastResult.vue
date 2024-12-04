<template>
  <div class="chart__container">
    <label>
      <input type="radio" value="line" v-model="chartType" />
      Line Chart
    </label>
    <label>
      <input type="radio" value="bar" v-model="chartType" />
      Bar Chart
    </label>

    <label>
      <input type="radio" value="table" v-model="chartType" />
      Table
    </label>
    <component
      :is="currentChartType"
      :historical-data="historicalData"
      :forecast-data="forecastData"
      :chart-options="chartOptions"
    />
  </div>
</template>

<script>
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import TableChart from './TableChart.vue'

export default {
  name: 'ParentChart',
  components: { BarChart, LineChart, TableChart },
  data() {
    return {
      historicalData: [100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350],
      forecastData: [380, 400, 420, 450],
      chartType: 'line',
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    }
  },
  computed: {
    currentChartType() {
      switch (this.chartType) {
        case 'line':
          return 'LineChart'
        case 'table':
          return 'TableChart'
        case 'bar':
        default:
          return 'BarChart'
      }
    },
  },
}
</script>

<style scoped>
.chart__container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
