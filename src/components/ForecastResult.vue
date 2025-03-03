<template>
  <h2>Результаты прогнозирования</h2>
  <div class="chart__container">
    <div class="chart-options-container">
      <div class="radio-container">
        <label v-for="option in chartOptions" :key="option.value">
          <input type="radio" :value="option.value" v-model="chartType" />
          {{ option.label }}
        </label>
      </div>
      <div class="buttons-container">
        <button @click="downloadPDF">Скачать PDF</button>
        <button @click="downloadExcel">Скачать Excel</button>
      </div>
    </div>
    <component
      :is="currentChartType"
      :historical-data="historicalData"
      :forecast-data="forecastData"
      :chart-options="chartConfig"
      :forecast-data-count="4"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store.js'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import TableChart from './TableChart.vue'
import AllCharts from './AllCharts.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Опции графиков
const chartOptions = [
  { label: 'All Methods', value: 'all' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Table', value: 'table' },
]

// Реактивные переменные
const chartType = ref('all')

const chartConfig = ref({
  responsive: true,
  scales: {
    x: { stacked: true, barPercentage: 0.5, categoryPercentage: 0.5 },
    y: { beginAtZero: true },
  },
})

// Получение данных из хранилища
const store = useStore()
const historicalData = computed(() => store.inputData)
const forecastData = computed(() => store.chartData)

// Определение текущего типа графика
const currentChartType = computed(() => {
  const chartMap = {
    line: LineChart,
    table: TableChart,
    all: AllCharts,
    bar: BarChart,
  }
  return chartMap[chartType.value] || BarChart
})

// Генерация данных таблицы
const getTableData = () => [
  ...historicalData.value.map((val, i) => [`Месяц ${i + 1}`, val, '-']),
  ...forecastData.value.map((val, i) => [`Месяц ${historicalData.value.length + i + 1}`, '-', val]),
]

// Генерация Excel-данных
const getExcelData = () => getTableData().map(([month, historical, forecast]) => ({
  Месяц: month,
  'Исторические данные': historical,
  Прогноз: forecast,
}))

// Скачать PDF
const downloadPDF = () => {
  const doc = new jsPDF()
  autoTable(doc, { head: [['Месяц', 'Исторические данные', 'Прогноз']], body: getTableData() })
  doc.save('table.pdf')
}

// Скачать Excel
const downloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(getExcelData())
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, 'table.xlsx')
}
</script>

<style scoped>
.chart__container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.chart-options-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.radio-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.buttons-container {
  display: flex;
  gap: 30px;
}

h2 {
  text-align: center;
}

label {
  cursor: pointer;
}

input[type='radio'] {
  cursor: pointer;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
