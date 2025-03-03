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
  forecastDataCount: {
    type: Number,
    required: true,
    default: 4,
  },
  chartOptions: {
    type: Object,
    required: true,
  },
});

const chartData = computed(() => {
  const historicalLabels = props.historicalData.map((_, index) => `${index + 1}`);
  const forecastLabels = props.forecastDataCount > 0
    ? Array(props.forecastDataCount).fill(0).map((_, idx) => `${props.historicalData.length + idx + 1}`)
    : [];

  const lastHistoricalValue = props.historicalData[props.historicalData.length - 1];

  const randomForecasts = Array.from({ length: props.forecastDataCount }, () =>
    Array(props.historicalData.length - 1).fill(null).concat(lastHistoricalValue).concat(
      Array(props.forecastDataCount).fill(0).map(() => Math.floor(Math.random() * 100) + 50)
    )
  );

  return {
    labels: [...historicalLabels, ...forecastLabels],
    datasets: [
      {
        label: 'Исторические данные',
        backgroundColor: 'rgba(66, 165, 245, 0.5)',
        borderColor: '#42A5F5',
        fill: true,
        data: props.historicalData,
        yAxisID: 'y',
      },
      ...randomForecasts.map((forecast, idx) => ({
        label: `Прогноз ${idx + 1}`,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        fill: true,
        data: forecast,
        yAxisID: 'y',
      }))
    ]
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
