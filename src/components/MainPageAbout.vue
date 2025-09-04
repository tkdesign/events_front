<template>
  <v-row>
    <v-col :cols="cols">
      <v-img
        cover
        height="418px"
        :src="getImageFullUrl(event.image)"
      ></v-img>
    </v-col>
    <v-col :cols="cols">
      <v-row>
        <v-col cols="12">
            <h4 class="text-h4">{{ event.about_title }}</h4>
            <div>{{ event.about_text }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="cols">
          <v-card>
            <v-card-title>{{ event.left_block_title }}</v-card-title>
            <v-card-text>{{ event.left_block_text }}</v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="cols">
          <v-card>
            <v-card-title>{{ event.right_block_title }}</v-card-title>
            <v-card-text>{{ event.right_block_text }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import {inject} from "vue";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  data() {
    const eventStore = inject('eventStore');
    return {
      eventStore,
    };
  },
  computed: {
    event() {
      return this.eventStore.event;
    },
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 6;
      }
    },
  },
  methods: {
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `${apiBaseUrl}${value}`;
    },
  },
}
</script>

<style scoped>

</style>