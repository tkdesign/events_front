<template>
  <v-app-bar app color="" scroll-behavior="elevate" :elevation="1" class="d-flex w-100 sticky-top">
    <v-app-bar-nav-icon @click="drawer = !drawer" v-if="isMobile"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ event.title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-slot:append v-if="!isMobile">
      <v-list variant="flat" class="horizontal-menu">
        <v-list-item
            variant="flat"
            v-for="(link, index) in visibleMenuItems"
            :key="index"
            :to="link.alias"
            :exact="true"
            :active="isActive(link.alias)"
        >
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
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
    const eventStore = inject('eventStore');
    const userStore = inject('userStore');
    return {
      topMenuStore,
      eventStore,
      userStore,
      drawer: false,
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    visibleMenuItems() {
      return this.topMenuStore.menu.filter(item => item.visible !== 0);
    },
    event() {
      return this.eventStore.event;
    },
    userName() {
      return this.userStore.user ? this.userStore.user.name : '';
    },
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
}
</script>

<style scoped>
.horizontal-menu {
  display: flex;
  flex-direction: row;
}
</style>