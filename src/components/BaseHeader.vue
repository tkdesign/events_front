<template>
  <v-app-bar app color="" scroll-behavior="elevate" :elevation="1" class="d-flex w-100 sticky-top">
    <v-app-bar-nav-icon @click="drawer = !drawer" v-if="isMobile"></v-app-bar-nav-icon>
    <v-toolbar-title>WEB DEV 2024</v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-slot:append v-if="!isMobile">
      <v-tabs>
        <v-tab
            v-for="(link, index) in visibleMenuItems"
            :key="index"
            :to="link.alias"
            :exact="true"
            :active="isActive(link.alias)"
        >
          {{ link.title }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item
          v-for="(link, index) in visibleMenuItems"
          :key="index"
          :to="link.alias"
          :exact="true"
          :active="isActive(link.alias)"
      >
        <v-list-item-title>{{ link.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {inject} from "vue";

export default {
  data() {
    const topMenuStore = inject('topMenuStore');
    return {
      topMenuStore,
      drawer: false,
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    visibleMenuItems() {
      return this.topMenuStore.menu.filter(item => item.visible !== false);
    },
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
  created() {
    if (this.topMenuStore.menu.length === 0) {
      this.topMenuStore.init();
    }
  },
}
</script>

<style scoped>
</style>