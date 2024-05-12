<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-row class="d-flex">
        <v-col :cols="cols_map">
          <v-img
              max-height = "400"
              cover
              src="../src/assets/images/contact/map.png"
              aspect-ratio="1"
              >
          </v-img>
        </v-col>
        <v-col :cols="cols_curators">
          <v-list
              :items="curators"
              lines="three"
              item-props
          >
            <template v-slot:subtitle="{ subtitle }">
              <div v-html="subtitle"></div>
            </template>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import PageHeader from "@/components/PageHeader.vue";
import {useCuratorsStore} from "@/stores/curatorsStore";

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  computed: {
    curators() {
      return this.curatorsStore.curators;
    },
    cols_map() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 8;
      }
    },
    cols_curators() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 4;
      }
    },
  },
  data() {
    const curatorsStore = useCuratorsStore();
    return {
      curatorsStore,
    }
  },
  created() {
    if (this.curatorsStore.curators.length === 0) {
      this.curatorsStore.init();
    }
  },
};
</script>

<style>

</style>