<template>
  <div>
    <table>
      <thead>
      <tr>
        <th>№</th>
        <th>Данные</th>
        <th v-for="method in forecastMethods" :key="method">{{ method }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in tableData" :key="index">
        <td>{{ row.month }}</td>
        <td>{{ row.historical }}</td>
        <td v-for="method in forecastMethods" :key="method">
          {{ row.forecast[method] || '' }}
        </td>
      </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="downloadPDF">Скачать PDF</button>
      <button @click="downloadExcel">Скачать Excel</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const props = defineProps({
  historicalData: {
    type: Array,
    required: true,
  },
  forecastData: {
    type: Object,
    required: true,
  },
})

const forecastMethods = computed(() => Object.keys(props.forecastData))

const tableData = computed(() => {
  const historicalLength = props.historicalData.length
  const maxForecastLength = Math.max(...forecastMethods.value.map(method => props.forecastData[method].length))

  const data = []

  props.historicalData.forEach((value, index) => {
    data.push({
      month: `${index + 1}`,
      historical: value,
      forecast: {},
    })
  })

  for (let i = 0; i < maxForecastLength; i++) {
    const row = {
      month: `${historicalLength + i + 1}`,
      historical: '',
      forecast: {},
    }

    forecastMethods.value.forEach(method => {
      row.forecast[method] = props.forecastData[method][i] || ''
    })

    data.push(row)
  }

  return data
})

const downloadPDF = () => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [['№', 'Данные', 'Прогноз']],
    body: tableData.value.map(({ month, historical, forecast }) => [month, historical, forecast]),
  })
  doc.save('table.pdf')
}

const downloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(tableData.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, 'table.xlsx')
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
