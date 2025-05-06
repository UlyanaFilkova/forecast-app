<template>
  <h2>Результаты прогнозирования</h2>

  <Tabs :tabs="forecastMethods" v-model:currentTab="currentTab">   </Tabs>
    <div class="chart-options-container">
      <div class="tabs">
        <div class="buttons-container">
          <BasicButton
            v-for="option in chartTypes"
            :key="option.value"
            :class="{ active: chartType === option.value }"
            @click="chartType = option.value"
          >
            {{ option.label }}
          </BasicButton>
        </div>
      </div>

      <div class="buttons-container">
        <BasicButton @click="downloadPDF">Скачать PDF</BasicButton>
        <BasicButton @click="downloadExcel">Скачать Excel</BasicButton>
      </div>
    </div>

    <component
      :is="currentChartType"
      :historical-data="historicalData"
      :forecast-data="filteredForecastData"
      :chart-options="chartConfig"
    />

</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from '@/stores/store.js'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import TableChart from './TableChart.vue'
import AllCharts from './AllCharts.vue'
import AllTable from './AllTable.vue'
import Tabs from '@/components/Tabs.vue'
import BasicButton from '@/components/basic/BasicButton.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const store = useStore()
const forecastMethods = ref(['All Methods', 'Linear Regression', 'ARIMA', 'Random Forest', 'KNN'])
const selectedMethod = computed(() => forecastMethods.value[currentTab.value])
const currentTab = ref(0)

let chartTypes = [
  { label: 'All Charts', value: 'all' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Table', value: 'table' },
]

const chartType = ref('all')

const updateChartType = () => {
  if (selectedMethod.value === 'All Methods') {
    chartType.value = 'all'
    chartTypes = [
      { label: 'All Charts', value: 'all' },
      { label: 'Table', value: 'allTable' },
    ]
  }else{
    chartType.value = 'line'
    chartTypes = [
      { label: 'Line Chart', value: 'line' },
      { label: 'Bar Chart', value: 'bar' },
      { label: 'Table', value: 'table' },
    ]
  }
}

watch(currentTab, updateChartType, {immediate: true})

const chartConfig = ref({
  responsive: true,
  scales: {
    x: { stacked: true, barPercentage: 0.5, categoryPercentage: 0.5 },
    y: { beginAtZero: true },
  },
})

const historicalData = computed(() => store.inputData)
const forecastData = computed(() => store.chartData)

const filteredForecastData = computed(() => {
  if (selectedMethod.value === 'All Methods') {
    return forecastData.value
  }
  return forecastData.value[selectedMethod.value] || []
})

const currentChartType = computed(() => {
  const chartMap = {
    line: LineChart,
    table: TableChart,
    all: AllCharts,
    allTable: AllTable,
    bar: BarChart,
  }
  return chartMap[chartType.value] || AllCharts
})

const getTableData = () => {
  const rows = []
  let forecast = filteredForecastData.value
  let methods = []

  if (Array.isArray(forecast)) {
    // If the forecast is an array (one method), convert it to an object
    methods = ['Forecast']
    forecast = { Forecast: forecast }
  } else if (typeof forecast === 'object' && forecast !== null) {
    // If forecast is an object with methods
    methods = Object.keys(forecast)
  } else {
    console.error("Unexpected forecast data structure:", forecast)
    return rows
  }

  rows.push(['', 'Data', ...methods])

  const historyLength = historicalData.value.length

  for (let i = 0; i < historyLength; i++) {
    const row = [`${i + 1}`, historicalData.value[i], ...methods.map(() => '')]
    rows.push(row)
  }

  const maxForecastLength = Math.max(...methods.map(m => (forecast[m] ? forecast[m].length : 0)))

  for (let i = 0; i < maxForecastLength; i++) {
    const row = [`${historyLength + i + 1}`, '', ...methods.map(method => forecast[method]?.[i] ?? '-')]
    rows.push(row)
  }
  return rows
}

const downloadPDF = () => {
  const doc = new jsPDF()
  autoTable(doc, {
    body: getTableData(),
  })
  doc.save('table.pdf')
}

const downloadExcel = () => {
  const tableData = getTableData();

  const dataWithoutHeaders = tableData.map(row => row.slice(1));

  const worksheet = XLSX.utils.aoa_to_sheet(dataWithoutHeaders);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Лист1');
  XLSX.writeFile(workbook, 'table.xlsx');
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
  margin-top: 20px;
  margin-bottom: 20px;
}

.radio-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.buttons-container {
  display: flex;
  gap: 20px;
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
