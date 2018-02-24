<template>
  <div id="chattable">
    <ChatBox/>
    <div class="chattable-fixed-wrap">
      <UnreadMessages/>
      <ChatButton/>
    </div>
  </div>
</template>

<script>
import ChatBox from './components/ChatBox'
import ChatButton from './components/ChatButton'
import UnreadMessages from './components/UnreadMessages'

export default {
  name: 'App',
  components: {
    ChatBox,
    ChatButton,
    UnreadMessages
  }
}
</script>

<style>
  .chattable-fixed-wrap {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
  }
</style>
