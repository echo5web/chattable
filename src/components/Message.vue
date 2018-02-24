<template>
    <transition name="message">
        <div class="message" :class="[message.cssClasses,message.source]">
            <img class="message-avatar" :src="avatars[message.source]" v-if="avatars[message.source]">
            <div class="message-line" v-html="message.content"></div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'Message',
  props: ['message'],
  data () {
    return {
      avatars: {
        bot: this.$config.botAvatar,
        user: false
      }
    }
  },
  methods: {
  }
}
</script>

<style>
  .message {
    display: flex;
    width: 100%;
  }
  .message-line {
    padding: 11px 17px;
    background: #fff;
    margin-bottom: 15px;
    box-shadow: 0 4px 6px rgba(139, 139, 191, 0.15), 0 1px 30px rgba(142, 152, 202, 0.1);
    border-radius: 20px;
    display: inline-block;
    color: #474e5a;
    box-sizing: border-box;
  }
  .user .message-line {
    margin-left: auto;
    background: #6170e6;
    color: white;
    border-top-right-radius: 2px;
  }
  .bot .message-line {
    border-top-left-radius: 2px;
  }
  .message-enter-active {
    transition: all .3s ease;
  }
  .message-leave-active {
    transition: none;
    display: none;
  }
  .message-enter.bot {
    transform: translateX(-20px);
    opacity: 0;
  }
  .message-enter.user {
    transform: translateX(20px);
    opacity: 0;
  }
  .message-avatar {
    float: left;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #33c7f3;
    margin-right: 10px;
  }
  .user .message-avatar {
    margin-right: 0px;
    margin-left: 10px;
    order: 2;
  }
  .bot + .bot .message-avatar {
    visibility: hidden;
  }

  .loading .message-line {
    height: 40px;
  }
  .loader,
  .loader:before,
  .loader:after {
    background: #525767;
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: .45em;
    height: 2em;
    border-radius: 5px;
  }
  .loader {
    color: #525767;
    text-indent: -9999em;
    margin: 5px 15px 5px 12px;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    position: absolute;
    top: 0;
    content: '';
  }
  .loader:before {
    left: -.8em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: .8em;
  }
  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: .7em;
    }
    40% {
      box-shadow: 0 -.7em;
      height: 1.4em;
    }
  }
</style>
