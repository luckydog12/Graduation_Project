import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: '',
        user: null,
        isUserLogin: false,
        outTradeNo: null,
        payId: null
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            if(token) {
                state.isUserLogin = true
            } else {
                state.isUserLogin = false
            }
        },
        setUser(state, user) {
            state.user = user
        },
        setOutTradeNo(state, outTradeNo) {
          state.outTradeNo = outTradeNo
        },
        setPayId(state, payId) {
          state.payId = payId
        }
    },
    actions: {
        setToken({commit}, token) {
            commit('setToken', token)
        },
        setUser({commit}, user) {
            commit('setUser', user)
        },
        setOutTradeNo({commit}, outTradeNo) {
          commit('setOutTradeNo', outTradeNo)
        },
        setPayId({commit}, payId) {
          commit('setPayId', payId)
        }
    },
    plugins: [createPersistedState()],
})

export default store