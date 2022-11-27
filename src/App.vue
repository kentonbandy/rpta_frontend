<template>
  <text-prompt />
</template>

<script>
import TextPrompt from '@/components/TextPrompt.vue'

export default {
  name: 'App',
  components: {
    TextPrompt
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: rgb(48, 48, 48);
}
</style>
