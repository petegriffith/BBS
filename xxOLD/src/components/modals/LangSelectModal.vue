<template>
  <div class="lang-modal">
    <div class="overlay"></div>
    <div class="modal_content">
      <header class="modal_header">
        <h3 class="modal_title">{{ $t('languages') }}</h3>
        <i title="Close" class="close_modal material-icons" @click="$emit('closeModal')">close</i>
      </header>
      <div class="list-container">
        <ul class="language-list">
          <li class="language-list-item" v-for="(lang, index) of languages" :key="index" @click="$emit('closeModalAndResetLocale', lang.lang)">{{ lang.label }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { curateLanguageList } from '../../global/utility/lang_country'

  const languages = curateLanguageList()

  defineEmits(['closeModal', 'closeModalAndResetLocale'])
</script>

<style scoped>
  .lang-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 990;
  }

  .lang-modal .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 995;
    background: rgba(0, 0, 0, 0.85);
  }

  .lang-modal .modal_content {
    z-index: 999;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 100vh;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    width: 100%;
    max-width: 50vw;
  }

  .lang-modal .modal_content {
    padding: 20px;
  }

  .modal_header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .lang-modal .close_modal {
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }

  .close_modal:hover {
    opacity: 0.9;
  }

  .modal_title {
    margin: 0;
  }

  .list-container {
    overflow-y: scroll;
    max-height: calc(100vh - 96px);
  }

  .language-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .language-list-item {
    padding: 16px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  .language-list-item:hover {
    background-color: rgb(250, 250, 250);
  }
</style>
