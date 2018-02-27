// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import defaultState from './store/defaultState'
import formParser from './utils/formParser'
import JSONfn from 'json-fn'

Vue.config.productionTip = false

const chattable = {

  init (args) {
    var element = document.createElement('div')
    element.id = 'chattable'
    document.body.appendChild(element)
    var initialState = Object.assign(defaultState, args)
    Vue.prototype.$config = initialState

    /* eslint-disable no-new */
    new Vue({
      el: '#chattable',
      store: store,
      components: { App },
      template: '<App/>',
      beforeCreate () {
        this.$store.commit('setInitialState', [initialState])
        this.$store.subscribe((mutation, state) => {
          if (initialState.persistedState) {
            localStorage.setItem(initialState.persistedState, JSONfn.stringify(state))
          }
        })
      }
    })
  },

  doStepId (id) {
    store.dispatch('doStepId', id)
  },

  getSteps (steps) {
    return store.state.steps
  },

  setSteps (steps) {
    store.commit('setSteps', steps)
  },

  addSteps (steps) {
    store.commit('addSteps', steps)
  },

  setMessages (messages) {
    store.commit('setMessages', messages)
  },

  getMessages (messages) {
    return store.state.messages
  },

  addBotMessage (content) {
    var message = {
      source: 'bot',
      content: content
    }
    store.dispatch('addBotMessage', [message])
  },

  addUserMessage (content) {
    var message = {
      source: 'user',
      content: content
    }
    store.commit('addMessage', message)
  },

  getStepsFromForm (formSelector, groupSelector, labelSelector, inputSelector, invalidMessageSelector, submitCallback, validateInput) {
    return formParser.getStepsFromForm(
      formSelector,
      groupSelector,
      labelSelector,
      inputSelector,
      invalidMessageSelector,
      submitCallback,
      validateInput
    )
  },

  getUserData () {
    return store.state.userData
  },

  setUserData (key, value) {
    store.commit('setUserData', [key, value])
  }

}

export default chattable
