<template>
  <div>
    <h2>Введите данные</h2>
    <form @submit.prevent="submitData">
      <textarea
        v-model="dataInput"
        @change="handleTextAreaUpload"
        placeholder="Введите текст здесь или прикрепите файл"
      ></textarea>
      <div class="file-input-container">
        <input type="file" @change="handleFileUpload" />
        <span v-if="fileError" class="error">{{ fileError }}</span>
        <select v-model="forecastMethod">
          <option value="exponential_smoothing">Метод экспоненциального сглаживания</option>
          <option value="linear_regression">Метод простой линейной регрессии</option>
          <option value="arima">Метод ARIMA</option>
        </select>
        <button type="submit" :disabled="isSubmitButtonDisabled">Загрузить данные</button>
      </div>
    </form>
    <TableModal
      :isOpen="showModal"
      :dataLines="dataLines"
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
      forecastMethod: 'exponential_smoothing',
      showModal: false,
      dataLines: [],
      numberSelected: 1,
      skipCells: 0,
      readingDirection: 'row',
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
    isSubmitButtonDisabled() {
      return this.dataInput.length === 0
      // return this.dataLines.length === 0 || this.dataLines.every((item) => item.length === 0)
    },
  },

  methods: {
    handleTextAreaUpload(event) {
      console.log(event.target.value)
      this.dataLines[0] = this.dataInput.split(' ')
      console.log(this.dataLines)

      const userStore = useStore()
      userStore.setData(this.dataLines[0])
      userStore.setLabels('')
      userStore.setMethod(this.forecastMethod)
      this.$emit('data-submitted')
    },
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
      }
    },
    readTextFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.dataLines = e.target.result.split('\n').map((line) => line.split(' '))
      }

      reader.readAsText(file)
      this.showModal = true
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
          this.dataLines.push(rowData)
        })
      }

      reader.readAsArrayBuffer(file)
      this.showModal = true
    },
   
    confirmSelection(numberSelected, skipCells, readingDirection, labelSelected) {
      console.log('Выбранный столбец/строка:', numberSelected)
      console.log('Сколько пропустить:', skipCells)
      console.log('Направление:', readingDirection)
      console.log('labels:', labelSelected)
      this.numberSelected = numberSelected
      this.skipCells = skipCells
      this.readingDirection = readingDirection
      this.showModal = false

      let extractedData = []
      let labels = []
      const labelIndex = labelSelected - 1

      if (readingDirection === 'row') {
        const rowIndex = numberSelected - 1

        if (this.dataLines[rowIndex]) {
          extractedData = this.dataLines[rowIndex].slice(skipCells)
          labels = this.dataLines[labelIndex].slice(skipCells)
        }
      } else if (readingDirection === 'column') {
        const columnIndex = numberSelected - 1

        for (let i = skipCells; i < this.dataLines.length; i++) {
          if (this.dataLines[i][columnIndex]) {
            extractedData.push(this.dataLines[i][columnIndex])
            labels.push(this.dataLines[i][labelIndex])
          }
        }
      }

      if (labelSelected === 0) {
        labels = new Array(extractedData.length).fill('')
      }

      const userStore = useStore()
      userStore.setData(extractedData)
      userStore.setData(this.forecastMethod)
      userStore.setLabels(labels)
      this.$emit('data-submitted')
    },
  },
}
</script>

<style scoped>
form {
  width: 100%;
  margin-bottom: 40px;
}
.data-input {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  resize: none;
  outline: none;
  font-family: Arial, sans-serif;
  font-size: 18px;
  margin-bottom: 10px;
}
textarea:focus {
  outline: 2px solid #3898ff;
  border: 1px solid #ffffff;
}
textarea::placeholder {
  font-size: 16px;
}

input::file-selector-button,
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

input::file-selector-button:hover,
button:hover {
  background-color: #0056b3;
}

button:disabled {
  cursor: auto;
  background-color: #889;
}

.file-input-container {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
}

input[type='file'] {
  width: 300px;
}

input::file-selector-button {
  margin-right: 20px;
}

select {
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #777;
  border-radius: 5px;
  cursor: pointer;
}

select:focus {
  outline: none;
}
</style>
