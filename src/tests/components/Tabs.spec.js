import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Tabs from '@/components/Tabs.vue'

describe('Tabs.vue', () => {
  const tabs = ['Первая', 'Вторая', 'Третья']

  it('рендерит все вкладки', () => {
    const wrapper = mount(Tabs, {
      props: { tabs }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(tabs.length)
    expect(buttons[0].text()).toBe('Первая')
    expect(buttons[1].text()).toBe('Вторая')
  })

  it('по умолчанию активна первая вкладка', () => {
    const wrapper = mount(Tabs, {
      props: { tabs }
    })

    const activeButton = wrapper.find('.tab.active')
    expect(activeButton.exists()).toBe(true)
    expect(activeButton.text()).toBe('Первая')
  })

  it('меняет вкладку при клике', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs }
    })

    const buttons = wrapper.findAll('button')

    await buttons[1].trigger('click')

    const activeButton = wrapper.find('.tab.active')
    expect(activeButton.exists()).toBe(true)
    expect(activeButton.text()).toBe('Вторая')
  })

  it('испускает событие update:currentTab', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs }
    })

    const thirdTab = wrapper.findAll('button')[2]
    await thirdTab.trigger('click')

    expect(wrapper.emitted('update:currentTab')).toBeTruthy()
    expect(wrapper.emitted('update:currentTab')[0]).toEqual([2])
  })
})
