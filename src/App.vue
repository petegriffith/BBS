<template>
  <div>
    <MainView />
  </div>
</template>

<script setup lang="ts">
  import MainView from './views/MainView.vue'
</script>

<style>
  body {
    margin: 0;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    border: 1px solid lightgrey;
    background: white;
  }

  @media only screen and (max-device-width: 767px) {
    #app {
      background: red
    }
  }
</style>
