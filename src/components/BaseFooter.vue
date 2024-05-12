<template>
  <v-footer class="w-100 d-block">
    <v-row no-gutters class="bg-grey-darken-4 px-5 m-0 bottom-menu-row">
      <v-container>
        <v-row class="bottom-menu-ribbon">
          <div class="d-flex flex-column logo-container justify-center">
            <!--          Здесь нужно разместить блок с названием конференции (как бы логотипом в текстовом виде), кратким описанием конференции, иконки соцсетей -->
            <div>WEB DEV 2024</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, enim hic impedit iusto maiores, maxime molestias natus odio, optio porro sapiente ullam veritatis voluptates? Animi distinctio dolores odio perferendis sint.</div>
            <div class="d-flex">
              <v-btn
                  v-for="icon in social_icons"
                  :key="icon"
                  :icon="icon"
                  class="mx-2"
                  variant="text"
              >
              </v-btn>
            </div>
          </div>
          <div
              v-for="(subheader, index) in subheaders"
              :key="'subheader-' + index"
              class="menu-column"
          >
            <v-list flat bg-color="transparent">
              <v-list-subheader color="grey">{{ subheader.title }}</v-list-subheader>
              <v-list-item
                  v-for="(link, i) in getLinksAfterSubheader(subheader)"
                  :key="'link-' + i"
                  :to="link.alias"
                  :exact="true"
                  :active="isActive(link.alias)"
              >
                <v-list-item-title>{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-row>
      </v-container>

<!--
      <v-btn
          v-for="(link, index) in visibleMenuItems"
          :key="index"
          class="mx-2"
          color="white"
          rounded="xl"
          variant="text"
      >
        <RouterLink :to="link.alias" :class="{ 'active': isActive(link.alias) }">
          {{ link.title }}
        </RouterLink>
      </v-btn>
-->

    </v-row>
    <v-row justify="center" no-gutters class="bg-black">
      <v-container>
        <v-col class="text-center" cols="12">
          {{ currentYear }} — <strong>Kovalenko &amp; Parfiriev</strong>
        </v-col>
      </v-container>
    </v-row>
  </v-footer>
</template>
<script>
import {inject} from "vue";

export default {
  data() {
    const topMenuStore = inject('topMenuStore');
    return {
      topMenuStore,
      currentYear: new Date().getFullYear(),
      social_icons: ['mdi-facebook', 'mdi-twitter', 'mdi-instagram', 'mdi-linkedin'],
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    visibleMenuItems() {
      return this.topMenuStore.bottom_menu.filter(item => item.visible !== false);
    },
    subheaders() {
      return this.visibleMenuItems.filter(item => item.type === 'subheader');
    },
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    getLinksAfterSubheader(subheader) {
      const index = this.visibleMenuItems.indexOf(subheader);
      const nextSubheaderIndex = this.visibleMenuItems.findIndex((item, i) => i > index && item.type === 'subheader');
      return this.visibleMenuItems.slice(index + 1, nextSubheaderIndex !== -1 ? nextSubheaderIndex : undefined);
    },
  },
  created() {
    if (this.topMenuStore.bottom_menu.length === 0) {
      this.topMenuStore.init();
    }
  },
}
</script>
<style scoped>
.v-footer {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.bottom-menu-row {
  padding-top: 10px;
  padding-bottom: 10px;
}

.bottom-menu-ribbon {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 300px;
}

.bottom-menu-ribbon div.menu-column {
  margin: 0 10px; /* Добавляем немного отступа между колонками */
  width: 200px;
}

.bottom-menu-ribbon div.logo-container {
  width: 300px;
  margin: 0 10px;
}

.bottom-menu-ribbon .v-list {
  margin: 0; /* Убираем отступы у списка */
}

.bottom-menu-ribbon .v-list-item {
  /*padding: 5px 0;*/ /* Добавляем немного отступа между элементами списка */
}
</style>