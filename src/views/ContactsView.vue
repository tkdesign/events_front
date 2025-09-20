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
              :src="getImageFullUrl(event.map)"
              aspect-ratio="1"
              >
          </v-img>
        </v-col>
        <v-col :cols="cols_curators">
          <v-list
              :items="curators"
              lines="three"
              item-props="true"
          >
            <template v-for="(curator, index) in curators" v-slot:prepend="{ item }">
              <v-avatar :key="index">
                <v-img :src="item.image"></v-img>
              </v-avatar>
            </template>
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
import {inject} from "vue";
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import PageHeader from "@/components/PageHeader.vue";
import {useCuratorsStore} from "@/stores/curatorsStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  computed: {
    event() {
      return this.eventStore.event;
    },
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
    const eventStore = inject('eventStore');
    const curatorsStore = useCuratorsStore();
    return {
      eventStore,
      curatorsStore,
    }
  },
  methods: {
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `${apiBaseUrl}${value}`;
    },
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