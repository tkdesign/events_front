<template>
  <v-row class="bg-grey-darken-3 page-header">
    <v-container>
      <div class="d-flex h-100 justify-end flex-column">
      <v-breadcrumbs :items="breadcrumbs" class="pl-0">
        <template #item="{ item }">
          <v-breadcrumbs-item :disabled="item.disabled" :to="item.href">{{ item.title }}</v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <h1>{{ currentPageTitle }}</h1>
      </div>
    </v-container>
  </v-row>
</template>

<script>
import {inject} from "vue";
export default {
  data() {
    const topMenuStore = inject('topMenuStore');
    return {
      topMenuStore,
    }
  },
  computed: {
    currentPageTitle() {
      const currentMenuItem = this.topMenuStore.menu.find(item => item.name === this.$route.name);
      return currentMenuItem ? currentMenuItem.page_title : this.$route.meta.title;
    },
    breadcrumbs() {
      const breadcrumbs = [];
      const homeRoute = this.topMenuStore.menu.find(item => item.name === 'home');
      const currentRoute = this.topMenuStore.menu.find(item => item.name === this.$route.name);
      if (homeRoute) {
        breadcrumbs.push({title: homeRoute.title, disabled: false, href: homeRoute.alias});
      }
      if (currentRoute) {
        breadcrumbs.push({title: currentRoute.title, disabled: true});
      }
      return breadcrumbs;
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
.page-header {
  padding-bottom: 20px;
  height: 300px;
  border-bottom: 1px solid #ccc;
}
</style>