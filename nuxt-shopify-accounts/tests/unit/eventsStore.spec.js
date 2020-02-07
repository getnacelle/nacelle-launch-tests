import storeConfig from '../storeConfig'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

describe('Event Store', () => {
  const store = new Vuex.Store(storeConfig())

  it('adds page view event to log array', async () => {
    store.dispatch('events/pageView', 'New Page')
    expect(store.state.events.log.length).toEqual(1)
    expect(store.state.events.log[0].eventType).toEqual('PAGE_VIEW')
    expect(store.state.events.log[0].payload).toEqual('New Page')
  })
})
