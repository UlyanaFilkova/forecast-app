<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" v-if="isOpen">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <!-- <h3>Введенные данные</h3> -->
        <div class="table-container">
          <table>
            <!-- <thead>
              <tr>
                <th>№</th>
                <th>Данные</th>
              </tr>
            </thead> -->
            <tbody>
              <tr v-for="(line, index) in dataLines" :key="index">
                <!-- <td>{{ index + 1 }}</td> -->
                <td v-for="(cell, cellIndex) in line" :key="cellIndex">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <label>Откуда считываем данные?</label>
          <div>
            <input type="radio" id="column" value="column" v-model="readingDirection" checked />
            <label for="column">Из столбца</label>
          </div>
          <div>
            <input type="radio" id="row" value="row" v-model="readingDirection" />
            <label for="row">Из строки</label>
          </div>
        </div>
        <label for="numberSelected">Выберите номер строки/столбца с данными:</label>
        <select v-model="numberSelected" id="numberSelected">
          <option v-for="i in numberOfColumns" :key="i" :value="i">{{ i }}</option>
        </select>
        <label for="skipCellsSelect">Сколько ячеек отступить от начала:</label>
        <select v-model="skipCells" id="skipCellsSelect">
          <option v-for="i in numberOfRows" :key="i" :value="i">{{ i }}</option>
        </select>
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
      skipCells: 1,
      readingDirection: 'column',
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    confirmSelection() {
      this.$emit('confirm', this.numberSelected, this.skipCells, this.readingDirection)
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

.table-container {
  max-height: 300px;
  overflow-y: auto;
}

.close {
  cursor: pointer;
}
</style>
