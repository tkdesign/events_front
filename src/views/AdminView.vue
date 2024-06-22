<template>
  <BaseHeader/>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <v-list>
            <v-list-subheader>ADMIN MENU</v-list-subheader>
            <v-list-item
                v-for="(link, index) in visibleMenuItems"
                :key="index"
                :value="link.path"
                color="primary"
                :active="isActive(link.path)"
                :to="link.path"
            >
              <template v-slot:prepend>
                <v-icon :icon="link.icon_class"></v-icon>
              </template>
              <v-list-item-title v-text="link.title"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="9">
          <v-container>
            <router-view></router-view>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from "@/components/BaseHeader.vue";
import BaseFooter from "@/components/BaseFooter.vue";
import PageHeader from "@/components/PageHeader.vue";
import {useAdminMenuStore} from "@/stores/adminMenuStore.js";

export default {
  components: {PageHeader, BaseHeader, BaseFooter},
  computed: {
    visibleMenuItems() {
      return this.adminMenuStore.adminMenu.filter(item => item.visible !== false);
    },
  },
  data() {
    const adminMenuStore = useAdminMenuStore();
    return {
      adminMenuStore,
    };
  },
  methods: {
    navigate(index) {
      this.$router.push(this.items[index].route);
    },
    isActive(path) {
      return this.$route.path === path;
    },
  },
  created() {
      this.adminMenuStore.init();
  },
};
</script>

<style scoped>

</style>