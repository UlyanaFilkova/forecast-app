<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" v-if="isOpen">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>Введенные данные</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, index) in dataLines" :key="index">
                <td v-for="(cell, cellIndex) in line" :key="cellIndex">{{ cell }}</td>
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
  },
  data() {
    return {
      selectedColumn: 1,
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    confirmColumnSelection() {
      this.$emit('confirm', this.selectedColumn)
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
</style>
