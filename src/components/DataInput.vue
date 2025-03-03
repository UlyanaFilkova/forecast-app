<template>
  <div>
    <h2>Введите данные</h2>
    <form @submit.prevent="submitForm">
      <textarea
        v-model="dataInput"
        @change="handleTextAreaUpload"
        placeholder="Введите текст здесь или прикрепите файл"
      ></textarea>
      <div class="file-input-container">
        <input type="file" @change="handleFileUpload" />
        <span v-if="fileError" class="error">{{ fileError }}</span>
        <select v-model="forecastMethod">
          <option value="linear_regression">Метод простой линейной регрессии</option>
          <option value="arima">Метод ARIMA</option>
          <option value="random_forest">Метод случайных лесов</option>
          <option value="knn">Метод KNN</option>
        </select>
        <button type="submit" :disabled="isSubmitButtonDisabled">Загрузить данные</button>
      </div>
    </form>
    <TableModal
      :isOpen="showModal"
      :dataLines="dataLines"
      :numberOfColumns="numberOfColumns"
      :numberOfRows="dataLines.length"
      @close="showModal = false"
      @confirm="confirmSelection"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store.js'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import ExcelJS from 'exceljs'
import TableModal from './TableModal.vue'

const emit = defineEmits(['data-submitted'])
const MAX_FILE_SIZE_IN_BYTES = 2 * 1024 * 1024 // 2 MB

const dataInput = ref('')
const file = ref(null)
const fileError = ref('')
const forecastMethod = ref('arima')
const showModal = ref(false)
const dataLines = ref([])
const numberSelected = ref(1)
const skipCells = ref(0)
const readingDirection = ref('column')

const fileValidation = {
  required,
  isFileType: (value) => {
    if (!value) return true
    const validExtensions = ['.xls', '.xlsx', '.txt']
    const fileName = value.name.toLowerCase()
    return validExtensions.some((ext) => fileName.endsWith(ext))
  },
  maxSize: (value) => {
    if (!value) return true
    return value.size <= MAX_FILE_SIZE_IN_BYTES
  },
}

const v$ = useVuelidate({
  required,
  isFileType: (value) => {
    if (!value) return true
    const validExtensions = ['.xls', '.xlsx', '.txt']
    const fileName = value.name.toLowerCase()
    return validExtensions.some((ext) => fileName.endsWith(ext))
  },
  maxSize: (value) => {
    if (!value) return true
    return value.size <= MAX_FILE_SIZE_IN_BYTES
  },
})

const numberOfColumns = computed(() => {
  if (dataLines.value[0]) {
    return dataLines.value.length > 0 ? dataLines.value[0].length : 0
  }
  return 0

})

const isSubmitButtonDisabled = computed(() => {
  return dataInput.value.length === 0 && dataLines.value.length === 0
})

const submitForm = () => {
  const userStore = useStore()
  userStore.setMethod(forecastMethod.value)
  emit('data-submitted')
}

const handleTextAreaUpload = (event) => {
  dataLines.value[0] = dataInput.value
    .split(' ')
    .map((item) => item.trim().replace(/\r/g, ''))
    .filter((item) => item !== '')

  const userStore = useStore()
  userStore.setData(dataLines.value[0])
  userStore.setLabels('')
  userStore.setMethod(forecastMethod.value)
}

const handleFileUpload = (event) => {
  dataInput.value = ''
  file.value = null
  fileError.value = ''
  numberSelected.value = 1
  skipCells.value = 0
  readingDirection.value = ''

  const selectedFile = event.target.files[0]
  file.value = selectedFile
  console.log(v$.value)
  v$.value.$touch()

  if (v$.$invalid) {
    if (v$.required.$invalid) {
      fileError.value = 'Загрузите файл или введите данные в текстовое поле'
    } else if (v$.isFileType.$invalid) {
      fileError.value = 'Неверный формат файла. Допустимые форматы: Excel или TXT.'
    } else if (v$.maxSize.$invalid) {
      fileError.value = `Формат файла должен быть меньше ${MAX_FILE_SIZE_IN_BYTES / 1024 / 1024} MB.`
    }
  } else {
    fileError.value = ''
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
      if (fileExtension === 'txt') {
        readTextFile(selectedFile)
      } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        readExcelFile(selectedFile)
      } else {
        fileError.value = 'Неверный формат файла. Допустимые форматы: Excel или TXT.'
      }
    }
  }
}

const readTextFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    dataLines.value = e.target.result.split('\n').map((line) =>
      line
        .split(' ')
        .map((item) => item.trim().replace(/\r/g, ''))
        .filter((item) => item !== '')
    )
  }
  reader.readAsText(file)
  showModal.value = true
}

const readExcelFile = (file) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = new ExcelJS.Workbook()

    await workbook.xlsx.load(data)
    const worksheet = workbook.worksheets[0]

    dataLines.value = []
    worksheet.eachRow((row, rowNumber) => {
      const rowData = row.values.slice(1)
      dataLines.value.push(rowData)
    })
  }

  reader.readAsArrayBuffer(file)
  showModal.value = true
}

const confirmSelection = (selectedNumber, skipCellsParam, readingDirectionParam, labelSelected) => {
  numberSelected.value = selectedNumber
  skipCells.value = skipCellsParam
  readingDirection.value = readingDirectionParam
  showModal.value = false

  let extractedData = ref([])
  let labels = ref([])
  const labelIndex = labelSelected - 1

  if (readingDirection.value === 'row') {
    const rowIndex = numberSelected.value - 1
    if (dataLines.value[rowIndex]) {
      extractedData.value = dataLines.value[rowIndex].slice(skipCells.value)
      labels.value = dataLines.value[labelIndex] ? dataLines.value[labelIndex].slice(skipCells.value) : Array(extractedData.length).fill('')
    }
  } else if (readingDirection.value === 'column') {
    const columnIndex = numberSelected.value - 1
    for (let i = skipCells.value; i < dataLines.value.length; i++) {
      if (dataLines.value[i][columnIndex]) {
        extractedData.value.push(dataLines.value[i][columnIndex])
        labels.value.push(dataLines.value[i][labelIndex])
      }
    }
  }

  if (labelSelected === 0) {
    labels.value = new Array(extractedData.value.length).fill('')
  }

  const userStore = useStore()
  console.log(extractedData.value)
  console.log(forecastMethod.value)
  console.log(labels.value)
  userStore.setData(extractedData.value)
  userStore.setMethod(forecastMethod.value)
  userStore.setLabels(labels.value)

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
  border-radius: 7px;
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
  /* margin-top: 10px; */
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
  gap: 15px;
  justify-content: space-between;
  margin-top: 10px;
}

input[type='file'] {
  width: 300px;
}

input::file-selector-button {
  margin-right: 15px;
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
