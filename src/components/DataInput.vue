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
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>Введенные данные</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Данные</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, index) in dataLines" :key="index">
                <td v-for="(cell, cellIndex) in line.split(' ')" :key="cellIndex">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <label for="columnSelect">Выберите номер столбца с данными:</label>
        <select v-model="selectedColumn" id="columnSelect">
          <option v-for="i in numberOfColumns" :key="i" :value="i">{{ i }}</option>
        </select>
        <button @click="confirmColumnSelection">Подтвердить выбор</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import * as XLSX from 'xlsx'

export default {
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
        return this.dataLines.length > 0 ? this.dataLines[0].split(' ').length : 0
      } else {
        return null
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
        const reader = new FileReader()
        reader.onload = (e) => {
          this.dataInput = e.target.result
          this.dataLines = this.dataInput.split('\n')
          console.log(this.dataLines[0])
          
          this.showModal = true
        }
        reader.readAsText(file)
      }
    },
    readTextFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.dataInput = e.target.result

        this.dataLines = this.dataInput.split('\n').map((line) => line.trim().split(' '))
        this.showModal = true
      }
      reader.readAsText(file)
    },
    readExcelFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        this.dataLines = jsonData // Сохраняем данные в dataLines
        this.showModal = true
      }
      reader.readAsArrayBuffer(file)
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
