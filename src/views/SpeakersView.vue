<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-row>
        <v-col
            v-for="(speaker, index) in speakers"
            cols="3"
        >
          <v-card
              class="mx-auto"
          >
            <v-img
                height="200px"
                :src="getImageFullUrl(speaker.image)"
                cover
            ></v-img>
            <v-card-title>
              {{ speaker.occupation }}
            </v-card-title>
            <v-card-subtitle>
              {{ makeFullName(speaker) }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                  color="orange-lighten-2"
                  text="More about speaker"
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
                  {{ speaker.desc }}
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
import {useSpeakersStore} from "@/stores/speakersStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  computed: {
    speakers() {
      return this.speakersStore.speakers;
    },
  },
  data() {
    const speakersStore = useSpeakersStore();
    const showCards = [];
    return {
      speakersStore,
      showCards: showCards,
    }
  },
  methods: {
    makeFullName(speaker) {
      if (!speaker) {
        return '';
      }
      return [speaker.titul, speaker.first_name, speaker.last_name].join(' ');
    },
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `${apiBaseUrl}${value}`;
    },
  },
  created() {
    if (this.speakersStore.speakers.length === 0) {
      this.speakersStore.init();
    }
  },
};
</script>

<style>

</style>