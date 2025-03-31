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

  const colors = {
    'Linear Regression': { backgroundColor: 'rgba(255, 140, 0, 0.2)', borderColor: 'rgba(255, 140, 0, 1)' }, // Темно-синий
    'ARIMA': { backgroundColor: 'rgba(200, 0, 0, 0.2)', borderColor: 'rgba(200, 0, 0, 1)' }, // Темно-красный
    'Random Forest': { backgroundColor: 'rgba(0, 0, 139, 0.2)', borderColor: 'rgba(0, 0, 139, 1)' }, // Темно-зеленый
    'KNN':  { backgroundColor: 'rgba(0, 180, 0, 0.2)', borderColor: 'rgba(0, 180, 0, 1)' }// Темно-желтый
  };

  sortedMethods.forEach((method) => {
    const color = colors[method] || { backgroundColor: 'rgba(200, 200, 200, 0.2)', borderColor: 'rgba(200, 200, 200, 1)' };
    datasets.push({
      label: method,
      backgroundColor: color.backgroundColor,
      borderColor: color.borderColor,
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
