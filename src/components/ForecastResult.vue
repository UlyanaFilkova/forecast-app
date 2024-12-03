<template>
  <div class="chart__container">
    <label>
      <input type="radio" value="bar" v-model="chartType" />
      Bar Chart
    </label>
    <label>
      <input type="radio" value="line" v-model="chartType" />
      Line Chart
    </label>
    <component :is="currentChartType" :historical-data="historicalData" :forecast-data="forecastData" :chart-options="chartOptions" />
  </div>
</template>

<script>
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';

export default {
  name: 'ParentChart',
  components: { BarChart, LineChart },
  data() {
    return {
      historicalData: [
        100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350,
      ],
      forecastData: [380, 400, 420, 450],
      chartType: 'bar', 
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
    };
  },
  computed: {
    currentChartType() {
      return this.chartType === 'line' ? 'LineChart' : 'BarChart'; 
    },
  },
};
</script>

<style scoped>
.chart__container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
</style>