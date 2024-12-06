<template>
  <div>
    <h2>Введите данные</h2>
    <form @submit.prevent="submitData">
      <textarea v-model="dataInput" placeholder="Введите данные..."></textarea>
      <input type="file" @change="handleFileUpload" />
      <span v-if="fileError" class="error">{{ fileError }}</span>
      <select v-model="forecastMethod">
        <option value="method1">Метод 1</option>
        <option value="method2">Метод 2</option>
      </select>
      <button type="submit">Загрузить данные</button>
    </form>
    <TableModal
      :isOpen="showModal"
      :dataLines="dataLines"
      :selectedColumn="selectedColumn"
      :numberOfColumns="numberOfColumns"
      :numberOfRows="this.dataLines.length"
      @close="showModal = false"
      @confirm="confirmSelection"
    />
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import ExcelJS from 'exceljs'
import TableModal from './TableModal.vue'

export default {
  components: {
    TableModal,
  },
  data() {
    return {
      v$: useVuelidate(),
      MAX_FILE_SIZE_IN_BYTES: 2 * 1024 * 1024, // 2 MB
      dataInput: '',
      file: null,
      fileError: '',
      forecastMethod: 'method1',
      showModal: false,
      dataLines: [],
      selectedColumn: 1,
      rowToStart: 1,
    }
  },
  validations() {
    return {
      file: {
        required,
        isFileType: (value) => {
          if (!value) return true
          const validExtensions = ['.xls', '.xlsx', '.txt']
          const fileName = value.name.toLowerCase()
          return validExtensions.some((ext) => fileName.endsWith(ext))
        },
        maxSize: (value) => {
          if (!value) return true
          return value.size <= this.MAX_FILE_SIZE_IN_BYTES
        },
      },
    }
  },
  computed: {
    numberOfColumns() {
      if (this.dataLines[0]) {
        return this.dataLines.length > 0 ? this.dataLines[0].toString().split(' ').length : 0
      } else {
        return 0
      }
    },
  },

  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      this.file = file
      this.v$.file.$touch()

      if (this.v$.file.$invalid) {
        if (this.v$.file.required.$invalid) {
          this.fileError = 'Загрузите файл или введите данные в текстовое поле'
        } else if (this.v$.file.isFileType.$invalid) {
          this.fileError = 'Неверный формат файла. Допустимые форматы: Excel или TXT.'
        } else if (this.v$.file.maxSize.$invalid) {
          this.fileError = `Формат файла должен быть меньше ${this.MAX_FILE_SIZE_IN_BYTES / 1024 / 1024} MB.`
        }
      } else {
        this.fileError = ''
        if (file) {
          const fileExtension = file.name.split('.').pop().toLowerCase()
          if (fileExtension === 'txt') {
            this.readTextFile(file)
          } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            this.readExcelFile(file)
          } else {
            this.fileError = 'Неверный формат файла. Допустимые форматы: Excel или TXT.'
          }
        }
        // const reader = new FileReader()
        // reader.onload = (e) => {
        //   this.dataLines = e.target.result.split('\n')

        //   // this.showModal = true
        // }
        // reader.readAsText(file)
      }
    },
    readTextFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.dataLines = e.target.result.split('\n').map(line => line.split(' '));
      
        this.showModal = true
      }
      reader.readAsText(file)
    },
    readExcelFile(file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = new ExcelJS.Workbook()

        await workbook.xlsx.load(data)
        const worksheet = workbook.worksheets[0]

        this.dataLines = []
        worksheet.eachRow((row, rowNumber) => {
          const rowData = row.values.slice(1) // Убираем первый элемент, который содержит номер строки
          this.dataLines.push(rowData); 
        })

        // this.showModal = true // Показываем модальное окно
      }

      reader.readAsArrayBuffer(file) // Читаем файл как ArrayBuffer
      this.showModal = true // Показываем модальное окно
    },
    submitData() {
      const data = {
        inputData: this.dataInput,
        url: this.url,
        method: this.forecastMethod,
      }
      // const userStore = useStore()
      // userStore.setData(data)
      // this.$emit('data-submitted', data)
    },
    confirmSelection(selectedColumn, rowToStart) {
      console.log('Выбранный столбец:', selectedColumn)
      console.log('Выбранная строка:', rowToStart)
      this.selectedColumn = selectedColumn
      this.rowToStart = rowToStart
      this.showModal = false
    },
  },
}
</script>

<style scoped>
.data-input {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  resize: none;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
