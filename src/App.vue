<template>
  <v-layout class="d-block">
    <RouterView />
  </v-layout>
</template>

<script>
import {RouterView, RouterLink} from 'vue-router'
import {inject} from "vue";

export default {
  data() {
    const topMenuStore = inject('topMenuStore');
    return {
      topMenuStore,
    }
  },
  components: {
    RouterView,
    RouterLink,
  },
}
</script>

<style>
</style>
