<template>
  <div>
    <ErrorView v-if="isError" :errorCode="errorCode" />
    <MainView v-else />
  </div>
</template>

<script setup lang="ts">
  import MainView from './views/MainView.vue'
  import ErrorView from './views/ErrorView.vue'

  import { getIsError, getErrorCode } from './global/store/getters'

  const isError = getIsError()
  const errorCode = getErrorCode()
</script>

<style>
  body {
    margin: 0;
    /* mobile viewport bug fix */
    height: 100vh;
    min-height: -webkit-fill-available;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    border: 1px solid lightgrey;
    background: white;
    height: calc(100vh - 2px);
  }
</style>
