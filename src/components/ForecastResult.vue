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
    <component :is="currentChartType" :chart-data="chartData" :chart-options="chartOptions" />
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
    chartData() {
      const historicalLabels = this.historicalData.map((_, index) => `Месяц ${index + 1}`);
      const forecastLabels = this.forecastData.map(
        (_, index) => `Месяц ${this.historicalData.length + index + 1}`,
      );
      const allLabels = [...historicalLabels, ...forecastLabels];

      return {
        labels: allLabels,
        datasets: [
          {
            label: 'Исторические данные',
            backgroundColor: this.chartType === 'line' ? 'rgba(66, 165, 245, 0.5)' : '#42A5F5',
            borderColor: '#42A5F5',
            fill: this.chartType === 'line', // Заполнение для линейного графика
            data: this.historicalData,
            spanGaps: true,
          },
          {
            label: 'Прогноз',
            backgroundColor: this.chartType === 'line' ? 'rgba(255, 167, 38, 0.5)' : '#FFA726',
            borderColor: '#FFA726',
            fill: this.chartType === 'line', // Заполнение для линейного графика
            data: Array(this.historicalData.length).fill(null).concat(this.forecastData),
            spanGaps: true,
          },
        ],
      };
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


<!-- <template>
  <div class="chart__container">
    <label>
      <input type="radio" value="bar" v-model="chartType" />
      Bar Chart
    </label>
    <label>
      <input type="radio" value="line" v-model="chartType" />
      Line Chart
    </label>

    <component :is="currentChartType" :data="chartData" :options="chartOptions" class="chart-bar" />
  </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale)

export default {
  components: { Bar, Line },
  data() {
    return {
      historicalData: [
        100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350, 100, 120, 130, 150, 170, 200,
        220, 250, 270, 300, 320, 350, 100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350,
      ],
      forecastData: [380, 400, 420, 450],
      chartType: 'bar',
      chartData: {
        labels: [],
        datasets: [],
      },
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
      return this.chartType === 'line' ? Line : Bar
    },
  },
  mounted() {
    this.prepareChartData()
  },
  methods: {
    toggleChartType() {
      this.chartOptions.scales.x.stacked = this.chartType === 'line' // Убираем стек при линейном графике
      this.chartOptions.scales.x.barPercentage = this.chartType === 'line' ? 1 : 0.5 // Устанавливаем параметры для линейного графика
      this.chartOptions.scales.x.categoryPercentage = this.chartType === 'line' ? 1 : 0.5
    },
    prepareChartData() {
      const historicalLabels = this.historicalData.map((_, index) => `Месяц ${index + 1}`)
      const forecastLabels = this.forecastData.map(
        (_, index) => `Месяц ${this.historicalData.length + index + 1}`,
      )
      const allLabels = [...historicalLabels, ...forecastLabels]

      this.chartData = {
        labels: allLabels,
        datasets: [
          {
            label: 'Исторические данные',
            backgroundColor: this.chartType === 'line' ? 'rgba(66, 165, 245, 0.5)' : '#42A5F5',
            borderColor: '#42A5F5',
            fill: this.chartType === 'line', // Заполнение для линейного графика
            data: this.historicalData,
          },
          {
            label: 'Прогноз',
            backgroundColor: this.chartType === 'line' ? 'rgba(255, 167, 38, 0.5)' : '#FFA726',
            borderColor: '#FFA726',
            fill: this.chartType === 'line', // Заполнение для линейного графика
            data: Array(this.historicalData.length).fill(null).concat(this.forecastData),
          },
        ],
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
.chart-bar {
  width: 1000px;
}
</style> -->
