<template>
  <div>
    <table>
      <thead>
      <tr>
        <th>№</th>
        <th>Данные</th>
        <th>Прогноз</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in tableData" :key="index">
        <td>{{ row.month }}</td>
        <td>{{ row.historical }}</td>
        <td>{{ row.forecast }}</td>
      </tr>
      </tbody>
    </table>
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
    type: Array,
    required: true,
  },
})

const tableData = computed(() => {
  return [
    ...props.historicalData.map((value, index) => ({
      month: `${index + 1}`,
      historical: value,
      forecast: '',
    })),
    ...props.forecastData.map((value, index) => ({
      month: `${props.historicalData.length + index + 1}`,
      historical: '',
      forecast: value,
    })),
  ]
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
  background-color: #bdd6ef;
}

.buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
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
