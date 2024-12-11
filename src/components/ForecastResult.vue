<template>
  <h2>Результаты прогнозирования</h2>
  <div class="chart__container">
    <div class="chart-options-container">
      <div class="radio-container">
        <label>
          <input type="radio" value="line" v-model="chartType" />
          Line Chart
        </label>
        <label>
          <input type="radio" value="bar" v-model="chartType" />
          Bar Chart
        </label>
        <label>
          <input type="radio" value="table" v-model="chartType" />
          Table
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
      :chart-options="chartOptions"
    />
  </div>
</template>

<script>
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import TableChart from './TableChart.vue'
import { useStore } from '@/stores/store.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  name: 'ParentChart',
  components: { BarChart, LineChart, TableChart },
  data() {
    return {
      // historicalData: [100, 120, 130, 150, 170, 200, 220, 250, 270, 300, 320, 350],
      // forecastData: [380, 400, 420, 450],
      chartType: 'line',
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
    historicalData() {
      const userStore = useStore()
      return userStore.inputData
    },
    forecastData() {
      const userStore = useStore()
      return userStore.chartData
    },
    currentChartType() {
      switch (this.chartType) {
        case 'line':
          return 'LineChart'
        case 'table':
          return 'TableChart'
        case 'bar':
        default:
          return 'BarChart'
      }
    },
  },
  methods: {
    downloadPDF() {
      const doc = new jsPDF()
      autoTable(doc, {
        head: [['Month', 'Historical Data', 'Forecast Data']],
        body: this.getTableData(),
      })
      doc.save('table.pdf')
    },
    downloadExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.getExcelData())
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, 'table.xlsx')
    },
    getTableData() {
      const data = []
      this.historicalData.forEach((value, index) => {
        data.push([`Month ${index + 1}`, value, '-'])
      })
      this.forecastData.forEach((value, index) => {
        data.push([`Month ${this.historicalData.length + index + 1}`, '-', value])
      })
      return data
    },
    getExcelData() {
      const data = []
      this.historicalData.forEach((value, index) => {
        data.push({ Месяц: `Месяц ${index + 1}`, 'Исторические данные': value, Прогноз: '-' })
      })
      this.forecastData.forEach((value, index) => {
        data.push({
          Месяц: `Месяц ${this.historicalData.length + index + 1}`,
          'Исторические данные': '-',
          Прогноз: value,
        })
      })
      return data
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
