<template>
  <button :class="['basic-button', { disabled: disabled }]" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.basic-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.basic-button:hover {
  background-color: #0056b3;
}

.basic-button:disabled {
  cursor: auto;
  background-color: #889;
}
</style>
