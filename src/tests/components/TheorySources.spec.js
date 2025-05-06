import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TheorySources from '@/components/TheorySources.vue'

// Заглушки для вложенных компонентов
vi.mock('@/components/Tabs.vue', () => ({
  default: {
    template: '<div><slot :currentTab="0" /></div>',
    props: ['tabs']
  }
}))
vi.mock('@/components/Theory/LinearRegression.vue', () => ({
  default: {
    template: '<div>Линейная регрессия компонент</div>'
  }
}))
vi.mock('@/components/Theory/ArimaMethod.vue', () => ({
  default: {
    template: '<div>ARIMA компонент</div>'
  }
}))
vi.mock('@/components/Theory/RandomForest.vue', () => ({
  default: {
    template: '<div>Случайные леса компонент</div>'
  }
}))
vi.mock('@/components/Theory/KnnMethod.vue', () => ({
  default: {
    template: '<div>KNN компонент</div>'
  }
}))
vi.mock('@/components/Theory/ForecastExamples.vue', () => ({
  default: {
    template: '<div>Примеры компонент</div>'
  }
}))

describe('TheorySources.vue', () => {
  it('рендерит заголовок и абзац', () => {
    const wrapper = mount(TheorySources)
    expect(wrapper.text()).toContain('Теория прогнозирования')
    expect(wrapper.text()).toContain('Прогнозирование — это процесс оценки будущих значений')
  })

  it('рендерит компонент по умолчанию (Линейная регрессия)', () => {
    const wrapper = mount(TheorySources)
    expect(wrapper.text()).toContain('Линейная регрессия компонент')
  })
})
