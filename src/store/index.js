import { createStore } from 'vuex'

const state = {
  roles: []
}

const mutations = {
  roles(state, payload) {
    state.roles = payload
  },
  logout(state) {
    state.roles = []
  }
}

export default createStore({
  state: state,
  mutations: mutations,
  actions: {},
  modules: {}
})
