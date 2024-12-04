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
      <button type="submit">Прогнозировать</button>
    </form>
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'
import { required, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

export default {
  data() {
    return {
      v$: useVuelidate(),
      MAX_FILE_SIZE_IN_BYTES: 2 * 1024 * 1024, // 2 MB
      dataInput: '',
      file: null,
      fileError: '',
      forecastMethod: 'method1',
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
    validationFile() {
      return {
        file: this.file,
      }
    },
  },

  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      this.file = file
      this.v$.file.$touch()
      console.log(this.file)
      if (this.v$.file.$invalid) {
        if (this.v$.file.required.$invalid) {
          this.fileError = 'Загрузите файл или введите данные в текстовое поле'
        } else if (this.v$.file.isFileType.$invalid) {
          this.fileError = 'Неверный формат файла. Допустимые форматы: Excel или TXT.'
        } else if (this.v$.file.maxSize.$invalid) {
          this.fileError = `Формат файла должен быть меньше ${this.MAX_FILE_SIZE_IN_BYTES / 1024 / 1024} MB.`
        }
        console.log(this.fileError)
      } else {
        this.fileError = ''

        const reader = new FileReader()
        reader.onload = (e) => {
          this.dataInput = e.target.result
        }
        reader.readAsText(file)
      }
    },
    submitData() {
      const data = {
        inputData: this.dataInput,
        url: this.url,
        method: this.forecastMethod,
      }
      const userStore = useStore()
      userStore.setData(data)
      this.$emit('data-submitted', data)
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
