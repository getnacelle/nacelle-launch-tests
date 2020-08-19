import storeConfig from '../storeConfig'
import Vue from 'vue'
import Vuex from 'vuex'
import { defaultLineItem } from '../mocks/defaultObjects'
import { mount } from '@vue/test-utils'
import QuantitySelector from '@/components/nacelle/QuantitySelector'

Vue.use(Vuex)

describe('QuantitySelector.vue', () => {
  it('if quantity equals 1 decrement removes item, if item specified in props', async () => {
    const store = new Vuex.Store(storeConfig())
    store.dispatch('cart/addLineItem', {
      ...defaultLineItem,
      quantity: 1
    })

    const WrapperComp = {
      template: `
      <quantity-selector
        :quantity="item.quantity"
        :item="item"
      />
      `,
      components: {
        QuantitySelector
      },
      data() {
        return {
          item: store.state.cart.lineItems[0]
        }
      }
    }
    const wrapper = mount(WrapperComp, {
      store
    }).findComponent(QuantitySelector)

    wrapper.vm.decrement()

    expect(store.state.cart.lineItems.length).toEqual(0)
  })
})
