<template>
  <focus-trap>
    <div aria-modal class="modal">
      <div class="modal-overlay" @click="$emit('closeModal')"></div>
      <div class="enlarged-image-content modal-content">
        <img :src="imgUrl" alt="enlarged image" class="enlarged-image" />
        <i role="button" aria-label="close" tabindex="1" class="image-close icon material-icons" @click="$emit('closeModal')">close</i>
        <i role="button" aria-label="download" tabindex="1" class="image-download icon material-icons" @click="handleImageDownload">download</i>
      </div>
    </div>
  </focus-trap>
</template>

<script setup lang="ts">
  import { downloadImage } from '../../global/utility/image'

  const props = defineProps({ imgUrl: String })

  defineEmits(['closeModal'])
  const handleImageDownload = () => {
    downloadImage(props.imgUrl!)
  }
</script>

<style scoped>
  .enlarged-image-content {
    padding: 0px;
    max-width: 90vw;
    width: auto;
    box-shadow: none;
  }
  .enlarged-image {
    max-width: 90vw;
    max-height: 90vh;
    /* height: 100px; */
  }

  .icon {
    cursor: pointer;
    color: grey;
    background: lightGrey;
    border-radius: 100%;
    border: grey 1px solid;
    position: absolute;
  }

  .image-close {
    right: 0.5em;
    top: 0.5em;
  }

  .image-download {
    right: 0.5em;
    top: 50%;
  }
</style>
