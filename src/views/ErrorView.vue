<template>
  <div class="flex-container">
    <h3>{{ errorMessages[1].ja }}</h3>
    <h3>{{ errorMessages[1].en }}</h3>
  </div>
</template>

<script setup lang="ts">
  import errorMessages from '../assets/errorMessages'
  const props = defineProps<{
    errorCode: number
  }>()
</script>

<style>
.flex-container {
    height: calc(100vh - 2px);
    display: flex;
    flex-direction: column; 
    justify-content: center;
}
</style>
