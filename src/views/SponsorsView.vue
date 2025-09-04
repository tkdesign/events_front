<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-row>
        <v-col
            v-for="(sponsor, index) in sponsors"
            :cols="cols"
        >
          <v-card
              class="mx-auto"
          >
            <a :href="sponsor.url" target="_blank"><v-img
                height="200px"
                :src="getImageFullUrl(sponsor.logo)"
                class="mx-5"
            ></v-img></a>
            <v-card-title>
              <a class="text-grey-darken-1 text-decoration-none" :href="sponsor.url" target="_blank">{{ sponsor.name }}</a>
            </v-card-title>
            <v-card-subtitle>
              {{ sponsor.short_desc }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                  color="orange-lighten-2"
                  text="More about sponsor"
              ></v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  :icon="showCards[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="showCards[index] = !showCards[index]"
              ></v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="showCards[index]">
                <v-divider></v-divider>
                <v-card-text>
                  {{ sponsor.desc }}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
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
import {useSponsorsStore} from "@/stores/sponsorsStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  computed: {
    sponsors() {
      return this.sponsorsStore.sponsors;
    },
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 4;
      }
    }
  },
  data() {
    const sponsorsStore = useSponsorsStore();
    const showCards = [];
    return {
      sponsorsStore,
      showCards: showCards,
    }
  },
  methods: {
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      if (/^\/images\/sponsors\//i.test(value)) {
        return `${apiBaseUrl}${value}`;
      }
      return value;
    },
  },
  created() {
    if (this.sponsorsStore.sponsors.length === 0) {
      this.sponsorsStore.init();
    }
  },
};
</script>

<style>

</style>