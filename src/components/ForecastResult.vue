<!-- <template>
  <div class="forecast-result">
    <h2>Результаты прогнозирования</h2>
    <div v-if="results">
      <h3>Исторические данные</h3>
      <ul>
        <li v-for="(value, index) in results.historicalData" :key="index">{{ value }}</li>
      </ul>
      <h3>Прогноз</h3>
      <ul>
        <li v-for="(forecast, index) in results.forecast" :key="index">{{ forecast }}</li>
      </ul>

      <h3>График прогнозирования</h3>
      <canvas id="forecastChart"></canvas>
    </div>
    <div v-else>
      <p>Нет данных для отображения.</p>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

export default {
  name: 'ForecastResult',
  props: {
    results: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      Chart.register(...registerables)
      const ctx = document.getElementById('forecastChart').getContext('2d')
      const historicalData = this.results.historicalData
      const forecastData = this.results.forecast

      const labels = historicalData.map((_, index) => `Месяц ${index + 1}`)
      const allData = [...historicalData, ...forecastData]
      const allLabels = [...labels, ...forecastData.map((_, index) => `Прогноз ${index + 1}`)]

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: allLabels,
          datasets: [
            {
              label: 'Исторические данные',
              data: historicalData,
              borderColor: 'blue',
              fill: false,
            },
            {
              label: 'Прогноз',
              data: forecastData,
              borderColor: 'orange',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped>
.forecast-result {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
}

h3 {
  color: #007bff;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

li {
  margin: 5px 0;
}

canvas {
  max-width: 100%;
  height: 400px;
}
</style> -->

<!-- <template>
  <div>
    <h2>График прогнозирования</h2>
    <Bar :chart-data="chartData" :options="chartOptions" ref="chart" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'ForecastChart',
  components: {
    Bar,
  },
  data() {
    return {
      historicalData: [100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350],
      forecastData: [380, 400, 420, 450],
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  
  mounted() {
    this.renderChart();
  },
  
  methods: {
    renderChart() {
      
      const labels = this.historicalData.map((_, index) => `Месяц ${index + 1}`);
      const allLabels = [...labels, ...this.forecastData.map((_, index) => `Прогноз ${index + 1}`)];

      this.chartData = {
        labels: allLabels,
        datasets: [
          {
            label: 'Исторические данные',
            data: this.historicalData,
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderWidth: 1,
          },
          {
            label: 'Прогноз',
            data: this.forecastData,
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1,
          },
        ],
      };
      console.log(this.chartData.labels.length)
    },
  },
};
</script> 

<style scoped>
.forecast-result {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
}
</style>-->

<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      historicalData: [100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350],
      forecastData: [380, 400, 420, 450],
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            barPercentage: 0.5, // Уменьшаем ширину столбцов
            categoryPercentage: 0.5 // Уменьшаем ширину категорий
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };
  },
  mounted() {
    this.prepareChartData();
  },
  methods: {
    prepareChartData() {
      // Создаем метки для исторических данных
      const historicalLabels = this.historicalData.map((_, index) => `Месяц ${index + 1}`);
      
      // Создаем метки для прогнозируемых данных, начиная с индекса, который следует за последним историческим
      const forecastLabels = this.forecastData.map((_, index) => `Месяц ${this.historicalData.length + index + 1}`);
      
      // Объединяем метки
      const allLabels = [...historicalLabels, ...forecastLabels];

      // Заполняем chartData
      this.chartData = {
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
            data: Array(this.historicalData.length).fill(null).concat(this.forecastData), // Заполняем исторические данные null для прогнозируемых
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
/* Добавьте стили, если необходимо */
</style>