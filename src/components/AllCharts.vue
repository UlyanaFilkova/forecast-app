<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
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
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

const props = defineProps({
  historicalData: {
    type: Array,
    required: true,
  },
  forecastData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    required: true,
  },
});

const chartData = computed(() => {
  const historicalLabels = props.historicalData.map((_, index) => `${index + 1}`);
  const forecastLabels = props.forecastData['ARIMA'].length
    ? Array(props.forecastData['ARIMA'].length).fill(0).map((_, idx) => `${props.historicalData.length + idx + 1}`)
    : [];

  const datasets = [
    {
      label: 'Исторические данные',
      backgroundColor: 'rgba(66, 165, 245, 0.5)',
      borderColor: '#42A5F5',
      fill: true,
      data: props.historicalData,
      yAxisID: 'y',
    }
  ];

  const methodOrder = ['Linear Regression', 'ARIMA', 'Random Forest', 'KNN'];

  const sortedMethods = methodOrder.filter((method) => method in props.forecastData);

  sortedMethods.forEach((method) => {
    datasets.push({
      label: method,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: true,
      data: [...Array(props.historicalData.length - 1).fill(null), props.historicalData.at(-1), ...props.forecastData[method]],
      yAxisID: 'y',
    });
  });

  return {
    labels: [...historicalLabels, ...forecastLabels],
    datasets,

  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
