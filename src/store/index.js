import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from './defaultState'
import JSONfn from 'json-fn'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: defaultState,
  getters: {
    currentStepIndex (state) {
      return state.steps.findIndex(function (step) {
        return step.id === state.currentStep.id
      })
    },
    currentStepHasOptions (state) {
      return state.currentStep && state.currentStep.options
    },
    currentStepHasUserInput (state) {
      return state.currentStep && state.currentStep.userInput
    }
  },
  actions: {

    doStep ({commit, state}, step) {
      commit('setCurrentStep', step)
      var callback = function () {
        store.dispatch('validateCurrentStep')
      }
      var message = {
        source: 'bot',
        content: step.message
      }
      store.dispatch('addBotMessage', [message, step.delay, step.duration, callback])
    },

    addBotMessage ({commit, state}, [message, delay, duration, callback]) {
      if (message.content) {
        delay = delay || delay === 0 ? delay : state.defaultDelay
        duration = duration || duration === 0 ? duration : state.defaultDuration
        setTimeout(function () {
          state.isTyping = true
          setTimeout(function () {
            state.isTyping = false
            // Add message if available and play sound
            if (message.content) {
              commit('addMessage', message)
              var audio = new Audio(state.notificationSound)
              audio.volume = 0.1
              audio.play()
            }
            // Add unread if closed
            if (!state.chatBoxOpen) {
              state.unreadMessages.push(message)
            }
            if (callback) {
              callback()
            }
          }, duration)
        }, delay)
      }
    },

    doStepId ({commit, state}, id) {
      var stepIndex = state.steps.findIndex(function (step) {
        return step.id === id
      })
      if (state.steps[stepIndex]) {
        store.dispatch('doStep', state.steps[stepIndex])
      }
    },

    validateCurrentStep ({commit, state}) {
      if (store.getters.currentStepHasOptions || store.getters.currentStepHasUserInput) {
        if (state.userInputObject) {
          var isValid = true
          if (state.currentStep.validate) {
            isValid = state.currentStep.validate(state.userInputObject)
          }
          if (isValid) {
            store.dispatch('moveToNextStep')
          } else {
            var invalidMessage = {
              source: 'bot',
              content: state.currentStep.invalidMessage,
              cssClasses: 'invalid-message'
            }
            store.dispatch('addBotMessage', [invalidMessage])
          }
        }
      } else {
        store.dispatch('moveToNextStep')
      }
    },

    moveToNextStep ({commit, state}) {
      // Set user data
      if (state.currentStep.key) {
        commit('setUserData', [state.currentStep.key, state.userInputObject.value])
      }

      // Do callback
      if (state.currentStep.callback) {
        state.currentStep.callback(state.currentStep, state.userInputObject)
      }

      // Go to trigger or next in array
      if (state.userInputObject && state.userInputObject.trigger) {
        var stepId = state.userInputObject.trigger
      } else if (state.currentStep.trigger) {
        stepId = state.currentStep.trigger
      } else {
        var nextStep = state.steps[store.getters.currentStepIndex + 1]
        stepId = nextStep ? nextStep.id : null
      }
      state.userInputObject = null
      store.dispatch('doStepId', stepId)
    },

    addUserInput ({commit, state}, object) {
      var message = {
        source: 'user',
        content: object.label ? object.label : object.value
      }
      commit('setUserInputObject', object)
      commit('addMessage', message)
      store.dispatch('validateCurrentStep')
    }

  },
  mutations: {
    setInitialState (state, [defaultState]) {
      if (defaultState.persistedState && localStorage.getItem(defaultState.persistedState)) {
        let persistedState = JSONfn.parse(localStorage.getItem(defaultState.persistedState))
        Object.keys(persistedState).forEach(key => { state[key] = persistedState[key] })
        if (state.currentStep && state.messages[state.messages.length - 1].content !== state.currentStep.message) {
          store.dispatch('doStep', state.currentStep)
        }
      } else {
        this.replaceState(defaultState)
        if (state.steps && !state.currentStep) {
          store.dispatch('doStep', state.steps[0])
        }
      }
    },
    addMessage (state, message) {
      if (message.content) {
        state.messages.push(message)
      }
    },
    setSteps (state, steps) {
      state.steps = steps
    },
    addSteps (state, steps) {
      state.steps = state.steps.concat(steps)
    },
    setMessages (state, messages) {
      state.messages = messages
    },
    setCurrentStep (state, step) {
      state.currentStep = step
    },
    setUserInputObject (state, object) {
      state.userInputObject = object
    },
    setUserData (state, [key, value]) {
      Vue.set(state.userData, key, value)
    },
    toggleChatBox (state) {
      if (state.chatBoxOpen) {
        state.chatBoxOpen = false
      } else {
        state.unreadMessages = []
        state.chatBoxOpen = true
      }
    }
  }
})

export default store
