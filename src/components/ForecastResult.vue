<template>
  <h2>Результаты прогнозирования</h2>
|
  <Tabs :tabs="forecastMethods" v-model:currentTab="currentTab">   </Tabs>
    <div class="chart-options-container">
      <div class="tabs">
        <button
          v-for="option in chartOptions"
          :key="option.value"
          :class="['tab', { active: chartType === option.value }]"
          @click="chartType = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="buttons-container">
        <button @click="downloadPDF">Скачать PDF</button>
        <button @click="downloadExcel">Скачать Excel</button>
      </div>
    </div>

    <component
      :is="currentChartType"
      :historical-data="historicalData"
      :forecast-data="filteredForecastData"
      :chart-options="chartConfig"
      :forecast-data-count="forecastSteps"
    />

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/store.js'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import TableChart from './TableChart.vue'
import AllCharts from './AllCharts.vue'
import Tabs from '@/components/Tabs.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const forecastMethods = ref(['All Methods', 'Linear Regression', 'ARIMA', 'Random Forest', 'KNN'])
const currentTab = ref(0)
const selectedMethod = computed(() => forecastMethods.value[currentTab.value])

const chartOptions = [
  { label: 'All Charts', value: 'all' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Table', value: 'table' },
]

const chartType = ref('all')

const chartConfig = ref({
  responsive: true,
  scales: {
    x: { stacked: true, barPercentage: 0.5, categoryPercentage: 0.5 },
    y: { beginAtZero: true },
  },
})

const store = useStore()
const historicalData = computed(() => store.inputData)
const forecastData = computed(() => store.chartData)
const forecastSteps = 5

const filteredForecastData = computed(() => {
  if (selectedMethod.value === 'All Methods') {
    return forecastData.value
  }
  return forecastData.value[selectedMethod.value] || []
})

// Определение текущего компонента графика
const currentChartType = computed(() => {
  const chartMap = {
    line: LineChart,
    table: TableChart,
    all: AllCharts,
    bar: BarChart,
  }
  return chartMap[chartType.value] || AllCharts
})

const getTableData = () => {
  const rows = []

  // Добавляем исторические данные
  historicalData.value.forEach((val, i) => {
    rows.push([`Месяц ${i + 1}`, val, '-'])
  })

  // Добавляем прогнозируемые данные
  Object.entries(filteredForecastData.value).forEach(([method, values]) => {
    values.forEach((val, i) => {
      rows.push([`Месяц ${historicalData.value.length + i + 1}`, '-', val])
    })
  })

  return rows
}

// Генерация данных для Excel
const getExcelData = () => {
  return getTableData().map(([month, historical, forecast]) => ({
    Месяц: month,
    'Исторические данные': historical,
    Прогноз: forecast,
  }))
}

// Скачать PDF
const downloadPDF = () => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['Месяц', 'Исторические данные', 'Прогноз']],
    body: getTableData(),
  })
  doc.save('table.pdf')
}

// Скачать Excel
const downloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(getExcelData())
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Лист1')
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
