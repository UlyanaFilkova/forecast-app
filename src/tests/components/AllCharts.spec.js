import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AllCharts from '@/components/AllCharts.vue'
import { Line } from 'vue-chartjs'

// Мокируем компонент Line (это компонент графика)
vi.mock('vue-chartjs', () => ({
  Line: vi.fn().mockName('LineChart')
}))

describe('AllCharts.vue', () => {
  let wrapper

  // Данные для тестирования
  const historicalData = [10, 20, 30, 40, 50]
  const forecastData = {
    ARIMA: [60, 70, 80],
    'Linear Regression': [55, 65, 75],
    'Random Forest': [50, 60, 70],
    KNN: [45, 55, 65],
  }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  beforeEach(() => {
    // Монтируем компонент перед каждым тестом с передачей данных
    wrapper = mount(AllCharts, {
      props: {
        historicalData,
        forecastData,
        chartOptions,
      },
    })
  })

  // 1. Проверка, что компонент LineChart отрисовывается
  it('рендерит график', () => {
    const lineChart = wrapper.findComponent(Line)
    expect(lineChart.exists()).toBe(true)
  })

  // 2. Проверка, что данные для графика правильно вычисляются
  it('правильно вычисляет данные для графика', () => {
    const chartData = wrapper.vm.chartData

    // Проверяем, что метки исторических данных правильные
    expect(chartData.labels.length).toBe(historicalData.length + forecastData['ARIMA'].length)
    expect(chartData.labels.slice(0, historicalData.length)).toEqual(['1', '2', '3', '4', '5'])

    // Проверяем, что исторические данные попадают в datasets
    const historicalDataset = chartData.datasets.find((dataset) => dataset.label === 'Исторические данные')
    expect(historicalDataset).toBeDefined()
    expect(historicalDataset.data).toEqual(historicalData)

    // Проверяем, что прогнозы добавлены в datasets
    Object.keys(forecastData).forEach((method) => {
      const forecastDataset = chartData.datasets.find((dataset) => dataset.label === method)
      expect(forecastDataset).toBeDefined()
      expect(forecastDataset.data.slice(historicalData.length)).toEqual(forecastData[method])
    })
  })

  // 3. Проверка, что методы сортируются в правильном порядке
  it('сортирует методы прогнозирования в правильном порядке', () => {
    const chartData = wrapper.vm.chartData

    const methodOrder = ['Linear Regression', 'ARIMA', 'Random Forest', 'KNN']
    const datasetLabels = chartData.datasets.map((dataset) => dataset.label)

    // Проверяем, что порядок методов в datasets соответствует заданному порядку
    const forecastMethods = datasetLabels.slice(1) // Пропускаем исторические данные
    expect(forecastMethods).toEqual(methodOrder)
  })

  // 4. Проверка, что правильные цвета используются для прогнозных методов
  it('использует правильные цвета для прогнозных методов', () => {
    const chartData = wrapper.vm.chartData
    const methodColors = {
      'Linear Regression': 'rgba(255, 140, 0, 0.2)',
      'ARIMA': 'rgba(200, 0, 0, 0.2)',
      'Random Forest': 'rgba(0, 0, 139, 0.2)',
      'KNN': 'rgba(0, 180, 0, 0.2)',
    }

    Object.keys(forecastData).forEach((method) => {
      const dataset = chartData.datasets.find((dataset) => dataset.label === method)
      expect(dataset.backgroundColor).toBe(methodColors[method])
    })
  })

  // 5. Проверка, что компонент правильно обновляется при изменении входных данных
  it('обновляется при изменении входных данных', async () => {
    const newHistoricalData = [60, 70, 80, 90, 100]
    const newForecastData = {
      ARIMA: [110, 120, 130],
      'Linear Regression': [105, 115, 125],
    }

    await wrapper.setProps({
      historicalData: newHistoricalData,
      forecastData: newForecastData,
    })

    const chartData = wrapper.vm.chartData
    expect(chartData.labels.length).toBe(newHistoricalData.length + newForecastData['ARIMA'].length)
    expect(chartData.datasets.find((dataset) => dataset.label === 'Исторические данные').data).toEqual(newHistoricalData)
  })
})
