<template>
  <div>
    <h2>Теория прогнозирования</h2>
    <p>Прогнозирование — это процесс оценки будущих значений на основе исторических данных.</p>
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab', { active: currentTab === index }]"
        @click="currentTab = index"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <component :is="components[currentTab]" />
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'

import LinearRegression from './Theory/LinearRegression.vue'
import ArimaMethod from './Theory/ArimaMethod.vue'
import RandomForest from './Theory/RandomForest.vue'
import KnnMethod from './Theory/KnnMethod.vue'

export default {
  components: {
    LinearRegression,
    ArimaMethod,
    RandomForest,
    KnnMethod,
  },
  data() {
    return {
      currentTab: 0,
      tabs: ['Линейная регрессия', 'ARIMA', 'Случайные леса', 'KNN'],
      components: [LinearRegression, ArimaMethod, RandomForest, KnnMethod],
    }
  },
}
</script>

<style scoped>
.theory {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h2,
p {
  color: #333;
  text-align: center;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #ddd;
  margin: 0 20px;
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
