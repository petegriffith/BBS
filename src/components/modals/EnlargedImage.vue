<template>
  <div class="modal">
    <div class="overlay"></div>
    <div class="modal_content">
      <i title="Close" class="close icon material-icons" @click="$emit('closeModal')">close</i>
      <i title="Close" class="download icon material-icons" @click="handleImageDownload">download</i>
      <img :src="imgUrl" alt="" class="enlarged_image" />
    </div>
  </div>
</template>

<script setup lang="ts">import { downloadImage } from '../../global/utility/image';

  const props = defineProps({ imgUrl: String })

  defineEmits(['closeModal'])
  const handleImageDownload = () => {
    downloadImage(props.imgUrl!)
  }
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
    transform: translate(-50%, -50%);
    max-height: 100vh;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
    border-radius: 4px;
  }

  .enlarged_image {
    max-width: 90vw;
    max-height: 90vh;
  }

  .icon {
    cursor: pointer;
    color: grey;
    background: lightGrey;
    border-radius: 100%;
    border: grey 1px solid;
    position: absolute;
  }

  .close {
    right: 0.5em;
    top: 0.5em;
  }

  .download {
    right: 0.5em;
    top: 50%;
  }
</style>
