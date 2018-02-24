<template>
  <div class="chat-unread-messages" @click="toggleChatBox" :class="{visible: !this.$store.state.chatBoxOpen}">
    <message v-for="(message, index) in this.$store.state.unreadMessages" :key="index" :message="message" />
  </div>
</template>

<script>
import Message from '../components/Message'

export default {
  name: 'UnreadMessages',
  components: { Message },
  data () {
    return {
    }
  },
  methods: {
    toggleChatBox () {
      this.$store.commit('toggleChatBox')
    }
  }
}
</script>

<style scoped>
    .chat-unread-messages {
        display: none;
    }
    .chat-unread-messages.visible {
        display: block;
    }
</style>
