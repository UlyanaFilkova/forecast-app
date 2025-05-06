import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BarChart from '@/components/BarChart.vue'
import { Bar } from 'vue-chartjs'

describe('BarChart.vue', () => {
  const mockHistoricalData = [10, 20, 30]
  const mockForecastData = [40, 50]
  const mockChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  it('рендерит компонент BarChart с правильными данными', () => {
    const wrapper = mount(BarChart, {
      props: {
        historicalData: mockHistoricalData,
        forecastData: mockForecastData,
        chartOptions: mockChartOptions
      }
    })

    const chart = wrapper.findComponent(Bar)
    expect(chart.exists()).toBe(true)

    const chartProps = chart.props('data')

    expect(chartProps.labels).toEqual(['1', '2', '3', '4', '5'])

    expect(chartProps.datasets[0]).toEqual(
      expect.objectContaining({
        label: 'Исторические данные',
        data: [10, 20, 30],
        backgroundColor: '#42A5F5'
      })
    )

    expect(chartProps.datasets[1]).toEqual(
      expect.objectContaining({
        label: 'Прогноз',
        data: [null, null, null, 40, 50],
        backgroundColor: '#FFA726'
      })
    )
  })
})
