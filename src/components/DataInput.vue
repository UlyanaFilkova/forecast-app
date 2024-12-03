<template>
    <div>
      <h2>Введите данные</h2>
      <form @submit.prevent="submitData">
        <textarea v-model="dataInput" placeholder="Введите данные..."></textarea>
        <input type="file" @change="handleFileUpload" />
        <input type="text" v-model="url" placeholder="Ссылка на сайт" />
        <select v-model="forecastMethod">
          <option value="method1">Метод 1</option>
          <option value="method2">Метод 2</option>
        </select>
        <button type="submit">Прогнозировать</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dataInput: '',
        url: '',
        forecastMethod: 'method1',
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.dataInput = e.target.result;
        };
        reader.readAsText(file);
      },
      submitData() {
        const data = {
          inputData: this.dataInput,
          url: this.url,
          method: this.forecastMethod,
        };
        this.$emit('data-submitted', data);
      },
    },
  };
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