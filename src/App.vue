<template>
  <v-layout class="d-block">
    <RouterView />
  </v-layout>
</template>

<script>
import {RouterView, RouterLink} from 'vue-router'

export default {
  components: {
    RouterView,
    RouterLink,
  },
}
</script>

<style>
</style>
