<template>
  <div class="chat-button" @click="toggleChatBox" :class="{open: this.$store.state.chatBoxOpen}">
    <img :src="buttonImage">
  </div>
</template>

<script>
export default {
  name: 'ChatButton',
  data () {
    return {
      buttonImage: this.$config.chatButtonImage
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
  .chat-button {
    background: pink;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transition: transform .25s ease-in-out;
  }
  .chat-button.open {
    transform: translate3d(0,300px,0);
  }
  .chat-button img {
    max-width: 100%;
  }
</style>
