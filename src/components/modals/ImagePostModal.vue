<template>
  <div class="modal">
    <div class="overlay"></div>
    <div class="modal_content">
      <h2 class="modal_title">{{ $t('uploadPhoto') }}</h2>
      <p class="modal_notes modal_notes_header">{{ $t('photoConstraintsHeader') }}</p>
      <p class="modal_notes">{{ $t('photoSizeConstraints') }}</p>
      <p class="modal_notes">{{ $t('photoFileConstraints') }}</p>
      <img src="" alt="" />
      <form class="form-content" role="form">
        <input type="file" class="file_input" name="photo" accept=".jpg, .jpeg, .gif, .png" @change="file = extractPhotoFile($event)" />
        <div class="ok-button button" role="button" @click="$emit('uploadPhotoAndCloseModal', file)">OK</div>
        <div class="cancel-button button" @click="$emit('closeModal')" role="button">{{ $t('cancel') }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref } from '@vue/reactivity'
  import { extractPhotoFile } from '../../global/utility/image'

  const file: Ref<File | undefined> = ref(undefined)

  defineEmits(['closeModal', 'uploadPhotoAndCloseModal'])
</script>

<style scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 990;
  }

  .modal .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 995;
    background: rgba(0, 0, 0, 0.85);
  }

  .modal .modal_content {
    z-index: 999;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    max-height: 100vh;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    width: 100%;
    max-width: 50vw;
  }

  .modal_title {
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    font-weight: bold;
  }
  .modal_notes {
    color: grey;
    margin: 0;
  }

  .modal_notes_header {
    margin-top: 1em;
    font-weight: bold
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
