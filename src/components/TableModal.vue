<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" v-if="isOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Введенные данные</h2>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <div class="table-container">
          <table>
            <tbody>
              <tr v-for="(line, index) in dataLines" :key="index">
                <td v-for="(cell, cellIndex) in line" :key="cellIndex">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="questions-container">
          <label>Откуда считываем данные?</label>
          <div>
            <input type="radio" id="column" value="column" v-model="readingDirection" checked />
            <label for="column">Из столбца</label>
          </div>
          <div>
            <input type="radio" id="row" value="row" v-model="readingDirection" />
            <label for="row">Из строки</label>
          </div>

          <label for="numberSelected">Выберите номер строки/столбца с данными:</label>
          <select v-model="numberSelected" id="numberSelected">
            <option v-for="i in numberOfRowsOrColumns" :key="i" :value="i">
              {{ i }}
            </option>
          </select>
          <label for="skipCellsSelect">Сколько ячеек отступить от начала:</label>
          <select v-model="skipCells" id="skipCellsSelect">
            <option v-for="i in numberOfRows" :key="i" :value="i - 1">{{ i - 1 }}</option>
          </select>
        </div>
        <button @click="confirmSelection">Подтвердить выбор</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    dataLines: {
      type: Array,
      required: true,
    },

    numberOfColumns: {
      type: Number,
      required: true,
    },
    numberOfRows: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      numberSelected: 1,
      skipCells: 0,
      readingDirection: 'column',
      labelSelected: 0,
    }
  },
  computed: {
    numberOfRowsOrColumns() {
      return this.readingDirection === 'row' ? this.numberOfRows : this.numberOfColumns
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    confirmSelection() {
      this.$emit(
        'confirm',
        this.numberSelected,
        this.skipCells,
        this.readingDirection,
        this.labelSelected,
      )
    },
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 20px;
}

.modal-header {
  display: flex;
}

h2 {
  flex-grow: 1;
  text-align: center;
}

.table-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #d6d6d6;
  border-radius: 5px;
  text-wrap: wrap;
}

.close {
  cursor: pointer;
  color: #e10000;
  font-size: 28px;
  font-weight: 500;
}

.questions-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  margin: 10px 5px;
}

button {
  display: block;
  margin: 0 auto;
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
label {
  margin-top: 5px;
}
select {
  padding: 2px 10px;
  font-size: 16px;
  border: 1px solid #777;
  border-radius: 5px;
  cursor: pointer;
}

select:focus {
  outline: none;
}
</style>
