<template>
  <focus-trap>
    <div class="modal">
      <div class="modal-overlay" @click="$emit('closeModal')"></div>
      <div class="modal-content">
        <header class="modal-header">
          <h2 class="modal-title">{{ t('languages') }}</h2>
          <i
            title="Close"
            class="close-modal material-icons"
            role="button"
            tabindex="0"
            aria-label="close"
            @click="$emit('closeModal')"
            >close</i
          >
        </header>
        <div class="list-container">
          <ul class="language-list">
            <li
              class="language-list-item"
              v-for="(lang, index) of languages"
              :key="index"
              role="button"
              tabindex="0"
              :aria-label="`select lang: ${lang.label}`"
              @click="$emit('closeModalAndResetLocale', lang.lang)"
            >
              {{ lang.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </focus-trap>
</template>

<script setup lang="ts">
  import { curateLanguageList } from '../../global/utility/lang_country'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({ useScope: 'global' })

  const languages = curateLanguageList()

  defineEmits(['closeModal', 'closeModalAndResetLocale'])
</script>

<style scoped>
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
