import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TableChart from '@/components/TableChart.vue'
import * as XLSX from 'xlsx'

vi.mock('jspdf-autotable', () => ({
  default: vi.fn()
}))

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: vi.fn(),
  })),
}))

vi.mock('xlsx', async () => {
  const actual = await vi.importActual('xlsx')
  return {
    ...actual,
    utils: {
      ...actual.utils,
      json_to_sheet: vi.fn(() => 'mockSheet'),
      book_new: vi.fn(() => 'mockBook'),
      book_append_sheet: vi.fn(),
    },
    writeFile: vi.fn(),
  }
})

describe('TableChart.vue', () => {
  const historicalData = [10, 20, 30]
  const forecastData = [40, 50]

  it('рендерит таблицу с историей и прогнозом', () => {
    const wrapper = mount(TableChart, {
      props: { historicalData, forecastData }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(5)

    expect(rows[0].text()).toContain('1')
    expect(rows[0].text()).toContain('10')

    expect(rows[4].text()).toContain('5')
    expect(rows[4].text()).toContain('50')
  })

  it('вызывает XLSX.writeFile при нажатии на Excel', async () => {
    const wrapper = mount(TableChart, {
      props: { historicalData, forecastData }
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalled()
    expect(XLSX.writeFile).toHaveBeenCalled()
  })
})
