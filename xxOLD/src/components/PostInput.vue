<template>
  <div class="reply-box" v-if="isReply">
    <!-- need to learn more about i18n for this one -->
    <p class="reply-box-text username">{{ replyInfo.usernameToReplyTo }}</p>
    <p class="reply-box-text message">{{ replyInfo.messageToReplyTo }}</p>
    <div class="input-button close-reply" role="button" @click="handleCloseReplyBoxClick"><i class="material-icons md-18 input-button">close</i></div>
  </div>
  <div class="input-container">
    <div v-if="!isInputFocused && inputMessage.length === 0" class="input-button" role="button" @click="checkIfUser() ? emit('openImageModal') : emit('showSetUserModal')">
      <i class="material-icons md-18 input-button">image</i>
    </div>
    <div v-else class="input-button no_pointer" role="icon"><i class="material-icons md-18 input-button no_pointer">close</i></div>
    <input
      type="text"
      class="text-input"
      @click="!checkIfUser() && emit('showSetUserModal')"
      @focus="isInputFocused = true"
      @blur="isInputFocused = false"
      @keyup.enter="handleSubmitMessageClick"
      v-model="inputMessage"
      :placeholder="$t('inputPlaceholder')"
    />
    <div class="input-button" role="button" @click="handleSubmitMessageClick"><i class="material-icons md-18 input-button">send</i></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineEmits } from 'vue'
  import { getIsReplyBool, getReplyInfo } from '../global/store/getters'
  import { toggleIsReply } from '../global/store/setters'
  import { checkIfUser } from '../global/utility/user'

  const emit = defineEmits(['postMessage', 'postReply', 'openImageModal', 'showSetUserModal', 'showSetUserModalThenOpenImageModal'])
  const isReply = getIsReplyBool()
  const replyInfo = getReplyInfo()
  const isInputFocused = ref(false)
  const inputMessage = ref('')


  const handleSubmitMessageClick = async () => {
    if (!isReply.value) {
      emit('postMessage', inputMessage.value)
    } else {
      emit('postReply', inputMessage.value)
    }
    inputMessage.value = ''
  }

  const handleCloseReplyBoxClick = () => {
    toggleIsReply()
  }
</script>

<style scoped>
  .input-container {
    display: flex;
    width: 100%;
    border-top: 1px solid lightgrey;
  }

  .text-input {
    width: 100vw;
    padding: 1em;
    border: none;
  }

  .input-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: lightgrey;
  }
  .reply-box {
    position: relative;
    border-top: 1px solid grey;
    text-align: left;
    padding: 0.8em 1em;
    font-size: 0.8em;
  }

  .reply-box-text {
    margin: 0;
  }

  .username {
    font-weight: bold;
    margin-bottom: 0.5em;
  }

  .message {
    color: #999999;
  }

  .close-reply {
    position: absolute;
    top: 1em;
    right: 0.8em;
  }

  .no_pointer {
    cursor: auto;
  }
</style>
