import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AllTable from '@/components/AllTable.vue'

vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      save: vi.fn(),
    })),
  }
})

vi.mock('jspdf-autotable', () => ({
  default: vi.fn()
}))

vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(),
    book_new: vi.fn(),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}))

describe('AllTable.vue', () => {
  let wrapper
  const historicalData = [10, 20, 30]
  const forecastData = {
    ARIMA: [40, 50],
    'Linear Regression': [45, 55, 65],
  }

  beforeEach(() => {
    wrapper = mount(AllTable, {
      props: {
        historicalData,
        forecastData,
      },
    })
  })

  it('рендерит таблицу с данными и прогнозами', () => {
    const rows = wrapper.findAll('tbody tr')
    const expectedRowCount = historicalData.length + 3
    expect(rows.length).toBe(expectedRowCount)
  })

  it('отображает имена методов прогноза в заголовке', () => {
    const headers = wrapper.findAll('thead th')
    const headerTexts = headers.map(th => th.text())
    expect(headerTexts).toContain('ARIMA')
    expect(headerTexts).toContain('Linear Regression')
  })

  it('отображает исторические данные', () => {
    const rows = wrapper.findAll('tbody tr')
    historicalData.forEach((value, index) => {
      const cell = rows[index].findAll('td')[1]
      expect(cell.text()).toBe(value.toString())
    })
  })

  it('вызывает downloadPDF при нажатии на кнопку PDF', async () => {
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default
    const saveMock = vi.fn()
    jsPDF.mockImplementation(() => ({ save: saveMock }))

    const button = wrapper.find('button:nth-of-type(1)')
    await button.trigger('click')

    expect(autoTable).toHaveBeenCalled()
    expect(saveMock).toHaveBeenCalled()
  })

  it('вызывает downloadExcel при нажатии на кнопку Excel', async () => {
    const XLSX = await import('xlsx')

    const button = wrapper.find('button:nth-of-type(2)')
    await button.trigger('click')

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalled()
    expect(XLSX.writeFile).toHaveBeenCalled()
  })
})
