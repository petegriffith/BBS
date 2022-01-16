<template>
  <focus-trap>
    <div class="modal">
      <div class="modal-overlay" @click="$emit('closeModal')"></div>
      <div class="modal-content">
        <header ref="modalElement" class="modal-header">
          <h2 class="modal-title">{{ t('uploadPhoto') }}</h2>
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
        <p class="notes notes_header">{{ t('photoConstraintsHeader') }}</p>
        <p class="notes">.jpg, .png, .gif</p>
        <p class="notes">{{ t('photoSizeConstraints') }}</p>
        <img src="" alt="" />
        <form class="form-content" role="form">
          <input
            ref="fileInput"
            type="file"
            class="file_input"
            name="photo-upload"
            accept=".jpg, .jpeg, .gif, .png"
            @change="file = extractPhotoFile($event)"
          />
          <div
            class="ok-button button"
            role="button"
            aria-label="upload confirm"
            tabindex="0"
            @click="$emit('uploadPhotoAndCloseModal', file)"
          >
            OK
          </div>
          <div class="cancel-button button" role="button" aria-label="cancel" tabindex="0" @click="$emit('closeModal')">
            {{ t('cancel') }}
          </div>
        </form>
      </div>
    </div>
  </focus-trap>
</template>

<script setup lang="ts">
  import { ref, Ref, onMounted } from 'vue'
  import { extractPhotoFile } from '../../global/utility/image'

  const file: Ref<File | undefined> = ref(undefined)
  const modalElement = ref<HTMLDivElement>()
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({ useScope: 'global' })

  onMounted(() => {modalElement.value?.focus()})

  defineEmits(['closeModal', 'uploadPhotoAndCloseModal'])
</script>

<style scoped>
  .notes {
    color: grey;
    margin: 0;
  }

  .notes_header {
    margin-top: 1em;
    font-weight: bold;
  }
  .form-content {
    display: flex;
    flex-direction: column;
    padding-top: 1em;
  }
  .label {
    text-align: left;
    font-weight: bold;
  }

  .input-box {
    padding: 1em;
    margin-bottom: 1em;
  }

  .nickname-input {
    border: solid 1px rgba(0, 0, 0, 0.6);
  }

  .button {
    padding: 1em;
    font-weight: bold;
    cursor: pointer;
  }

  .ok-button {
    border: 1px solid black;
  }

  .file_input {
    margin-bottom: 1em;
  }
</style>
