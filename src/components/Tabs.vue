<template>
  <div class="tabs-container">
  <div class="tabs">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      :class="['tab', { active: currentTab === index }]"
      @click="changeTab(index)"
    >
      {{ tab }}
    </button>
  </div>
  <div class="tab-content">
    <slot :currentTab="currentTab"></slot>
  </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({ tabs: Array })
const emit = defineEmits(['update:currentTab'])
const currentTab = ref(0)

const changeTab = (index) => {
  currentTab.value = index
  emit('update:currentTab', index)
}

watchEffect(() => {
  if (props.tabs && props.tabs.length > 0 && currentTab.value >= props.tabs.length) {
    currentTab.value = 0
    emit('update:currentTab', 0)
  }
})
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 2px solid #ddd;
  justify-content: center;
}

.tab {
  flex-grow: 1;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid #ddd;
  border-bottom: none;
  background-color: #f1f1f1;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: #e7e7e7;
}

.tab.active {
  background-color: #a0ceff;
  color: black;
  border-top: 2px solid #439eff;
  border-left: 2px solid #439eff;
  border-right: 2px solid #439eff;
  border-radius: 7px 7px 0 0;
  font-weight: bold;
}
</style>
