<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
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

const props = defineProps({
  historicalData: Array,
  forecastData: Array,
  chartOptions: Object,
});

const chartData = computed(() => {
  const historicalLabels = props.historicalData.map((_, index) => `${index + 1}`);
  const forecastLabels = props.forecastData.map((_, index) => `${props.historicalData.length + index + 1}`);
  const allLabels = [...historicalLabels, ...forecastLabels];

  return {
    labels: allLabels,
    datasets: [
      {
        label: 'Исторические данные',
        backgroundColor: '#42A5F5',
        data: props.historicalData,
      },
      {
        label: 'Прогноз',
        backgroundColor: '#FFA726',
        data: Array(props.historicalData.length).fill(null).concat(props.forecastData),
      },
    ],
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
