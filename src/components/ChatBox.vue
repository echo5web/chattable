<template>
  <div class="chat-box" :class="{open: this.$store.state.chatBoxOpen}">
    <div class="chat-box-close" @click="toggleChatBox"></div>
    <div class="messages-wrap">
      <div class="messages" ref="messages">
        <message v-for="(message, index) in messages" :key="index" :message="message" />
        <message v-if="isTyping" :message="typingMessage" />
        <div class="chat-box-options" :data-steps="currentStep.options.length" v-if="currentStepHasOptions && !isTyping">
          <div v-for="(option, index) in currentStep.options" :key="index" class="chat-box-option" v-html="option.label" @click="selectOption(option)">
          </div>
        </div>
      </div>
    </div>
    <div class="user-input-wrap" :class="{'enabled': currentStepHasUserInput}">
      <div class="user-input-inner">
        <textarea class="user-input" ref="userInput" @keypress.enter="submitUserInput" v-model="userInputValue" :disabled="!currentStepHasUserInput"></textarea>
        <img class="btn-send" :src="sendButtonImage" @click="submitUserInput">
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Message from '../components/Message'

export default {
  name: 'ChatBox',
  components: {
    Message
  },
  data () {
    return {
      messages: this.$store.state.messages,
      userInputValue: '',
      sendButtonImage: this.$config.sendButtonImage,
      typingMessage: {
        source: 'bot',
        cssClasses: 'loading',
        content: '<div class="loader">...</div>'
      }
    }
  },
  computed: {
    isTyping () {
      return this.$store.state.isTyping
    },
    currentStep () {
      return this.$store.state.currentStep
    },
    currentStepHasOptions () {
      return this.$store.getters.currentStepHasOptions
    },
    currentStepHasUserInput () {
      if (this.$store.getters.currentStepHasUserInput) {
        var _this = this
        Vue.nextTick(function () {
          _this.$refs.userInput.focus()
        })
        return true
      }
    }
  },
  updated () {
    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
  },
  methods: {
    submitUserInput (e) {
      e.preventDefault()
      this.$store.dispatch('addUserInput', { value: this.userInputValue, type: 'message' })
      this.userInputValue = ''
    },
    selectOption (option) {
      this.$store.dispatch('addUserInput', option)
    },
    toggleChatBox () {
      this.$store.commit('toggleChatBox')
    }
  }
}
</script>

<style scoped>
  .chat-box * {
    box-sizing: border-box;
  }
  .chat-box {
    position: fixed;
    right: 0px;
    bottom: 0px;
    width: 380px;
    font-size: 16px;
    max-height: 100vh;
    transition: transform .25s ease-in-out;
    transform: translate3d(100%,0,0);
    padding-right: 20px;
  }
  .chat-box.open {
    transform: translate3d(0%,0,0);
  }
  .messages-wrap {
    overflow: hidden;
  }
  .messages {
    max-height: 100vh;
    padding: 20px 40px 100px 40px;
    overflow-y: auto;
    margin-right: -40px;
    margin-left: -20px;
    overflow: auto;
  }
  .chat-box-options {
    margin: 20px 0;
    display: inline-block;
    width: 100%;
  }
  .chat-box-option {
    border-radius: 7px;
    padding: 15px 25px;
    float: left;
    margin-right: 10px;
    cursor: pointer;
    background: #6170e6;
    color: white;
    text-align: center;
    box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);
  }
  [data-steps="2"] .chat-box-option {
    width: 48%;
    margin-right: 0;
  }
  [data-steps="2"] .chat-box-option:first-child {
    margin-right: 4%;
  }
  .user-input-wrap {
    padding: 20px;
    transition: transform .25s ease-in-out;
    transform: translate3d(0,100%,0);
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
  }
  .user-input-wrap.enabled {
    transform: translate3d(0,0%,0);
  }
  .user-input-inner {
    position: relative;
  }
  .user-input {
    width: 100%;
    line-height: 2;
    border-radius: 25px;
    box-shadow: 4px 6px 28px rgba(0,0,0,0.01), 0 3px 10px rgba(0,0,0,0.15);
    outline: none;
    border: 0;
    padding: 8px 20px;
    box-sizing: border-box;
    font-size: 16px;
    height: 48px;
    resize: none;
    padding-right: 40px;
  }
  .user-input-inner .btn-send {
    max-width: 20px;
    position: absolute;
    top: 50%;
    right: 5px;
    margin-top: -2px;
    margin-right: 10px;
    transform: translate3d(0,-50%,0);
    cursor: pointer;
    opacity: .5;
  }
  .user-input-inner .btn-send:hover {
    opacity: 1;
  }
  .chat-box-close {
    position: absolute;
    right: 15px;
    top: 15px;
    background: white;
    border-radius: 50%;
    border: 1px solid #fff;
    height: 24px;
    width: 24px;
    opacity: .5;
    background: #b9c0ce;
  }
  .chat-box-close:hover {
    opacity: 1;
  }
  .chat-box-close:before, .chat-box-close:after {
    content: '';
    position: absolute;
    height: 2px;
    width: 60%;
    top: 50%;
    left: 20%;
    margin-top: -1px;
    background: #fff;
  }
  .chat-box-close:before {
    transform: rotate(45deg);
  }
  .chat-box-close:after {
    transform: rotate(-45deg);
  }
</style>
