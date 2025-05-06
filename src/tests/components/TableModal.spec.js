import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TableModal from '@/components/TableModal.vue'

const basicProps = {
  isOpen: true,
  dataLines: [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2']
  ],
  numberOfColumns: 3,
  numberOfRows: 2
}

describe('TableModal.vue', () => {
  it('не отображается, если isOpen = false', () => {
    const wrapper = mount(TableModal, {
      props: { ...basicProps, isOpen: false }
    })

    expect(wrapper.find('.modal-backdrop').exists()).toBe(false)
  })

  it('отображает таблицу с данными', () => {
    const wrapper = mount(TableModal, {
      props: basicProps
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('A1')
    expect(rows[1].text()).toContain('B2')
  })

  it('переключает радиокнопки направления чтения', async () => {
    const wrapper = mount(TableModal, {
      props: basicProps
    })

    const rowRadio = wrapper.find('input#row')
    await rowRadio.setValue()

    expect(rowRadio.element.checked).toBe(true)

    const selectOptions = wrapper.findAll('#numberSelected option')
    expect(selectOptions.length).toBe(2) // т.к. выбрано "row" => 2 строки
  })

  it('испускает событие close при нажатии на ×', async () => {
    const wrapper = mount(TableModal, {
      props: basicProps
    })

    await wrapper.find('.close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('испускает confirm с правильными значениями', async () => {
    const wrapper = mount(TableModal, {
      props: basicProps
    })

    // Выбор значения
    await wrapper.find('#row').setValue() // направление — строка
    await wrapper.find('#numberSelected').setValue('2') // номер строки — 2
    await wrapper.find('#skipCellsSelect').setValue('1') // отступ — 1

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
    const args = wrapper.emitted('confirm')[0]

    expect(args).toEqual([2, 1, 'row', 0])
  })
})
