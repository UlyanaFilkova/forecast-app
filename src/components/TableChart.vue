<template>
  <div>
    
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Исторические данные</th>
          <th>Прогноз</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in historicalData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ value }}</td>
          <td>-</td>
        </tr>
        <tr v-for="(value, index) in forecastData" :key="historicalData.length + index">
          <td>{{ historicalData.length + index + 1 }}</td>
          <td>-</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default {
  name: 'TableChart',
  props: {
    historicalData: {
      type: Array,
      required: true,
    },
    forecastData: {
      type: Array,
      required: true,
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


</style>
