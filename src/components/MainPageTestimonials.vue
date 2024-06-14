<template>
  <v-row>
    <h4 class="text-h4 mb-5">Testimonials</h4>
  </v-row>
  <v-row>
    <v-col :cols="cols">
        <v-row>
          <v-col
              v-for="(testinonial, n) in testimonials"
              :key="n"
              class="d-flex child-flex"
              :cols="cols_thumbs_grid"
          >
              <v-img
                  :lazy-src="testinonial.thumbnail"
                  :src="getImageFullUrl(testinonial.thumbnail)"
                  aspect-ratio="1"
                  :class="{'border-2': isSelected}"
                  class="cursor-pointer"
                  cover
                  @click="selectTestimonial(testimonials[n])"
              >
                <template v-slot:placeholder>
                  <v-row
                      align="center"
                      class="fill-height ma-0"
                      justify="center"
                  >
                    <v-progress-circular
                        color="grey-lighten-5"
                        indeterminate
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>

          </v-col>
        </v-row>
    </v-col>
    <v-col :cols="cols">
      <MainPageTestimonialsReview :testimonial="tm" v-if="isSelected"/>
    </v-col>
    <v-col :cols="cols">
      <v-img
          cover
          height="418px"
          :src="getImageFullUrl(tm.image)"
          v-if="isSelected"
      >
      </v-img>
    </v-col>
  </v-row>
</template>

<script>
import MainPageTestimonialsReview from "@/components/MainPageTestimonialsReview.vue";
import {useTestimonialsStore} from "@/stores/testimonialsStore.js";

export default {
  components: {MainPageTestimonialsReview},
  computed: {
    testimonials() {
      return this.testimonialsStore.testimonials;
    },
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 4;
      }
    },
    cols_thumbs_grid() {
      if (this.$vuetify.display.mobile) {
        return 4;
      } else {
        return 3;
      }
    },
  },
  data() {
    const testimonialsStore = useTestimonialsStore();
    return {
      testimonialsStore,
      tm: Object,
      isSelected: false,
      wasMounted: false,
      wasCreated: false,
    }
  },
  watch: {
    testimonialsStore: {
      handler() {
        if (this.testimonialsStore.testimonials.length > 0) {
          this.tm = this.testimonialsStore.testimonials[0];
          this.isSelected = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    selectTestimonial(testimonial) {
      this.tm = testimonial;
      this.isSelected = true;
    },
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `http://localhost/events/backend/public${value}`;
    },
  },
  mounted() {
    if(this.testimonialsStore.testimonials.length === 0) {
      if(!this.wasCreated) {
        this.testimonialsStore.init();
      }
    } else {
      this.tm = this.testimonialsStore.testimonials[0];
      this.isSelected = true;
    }
    this.wasMounted = true;
  },
  beforeUpdate() {
    if (!this.wasMounted && this.testimonialsStore.testimonials.length === 0) {
      this.testimonialsStore.init();
    } else {
      this.tm = this.testimonialsStore.testimonials[0];
      this.isSelected = true;
    }
  },
  created() {
    if (this.testimonialsStore.testimonials.length === 0) {
      this.testimonialsStore.init();
      this.wasCreated = true;
    }
  },
}
</script>

<style scoped>

</style>