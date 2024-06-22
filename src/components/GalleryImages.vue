<template>
  <v-row>
    <v-col
        v-for="(image,n) in images"
        :key="n"
        class="d-flex child-flex"
        :cols="cols"
    >
      <v-img
          :lazy-src="getImageFullUrl(image.thumbnail)"
          :src="getImageFullUrl(image.image)"
          :key="image.image_id"
          aspect-ratio="1"
          class="bg-grey-lighten-2 cursor-pointer"
          cover
          @click="openLightbox(image)"
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
  <v-overlay
      :model-value="lightbox"
      class="align-center justify-center"
      @click:outside="lightbox = false"
      @click:escape="lightbox = false"
      @click="lightbox = false"
      width="100%"
  >
    <v-container fluid>
        <v-img
            :src="getImageFullUrl(selectedImage.image)"
            aspect-ratio="1"
            class="bg-grey-lighten-2 cursor-pointer"
            cover
        >
        </v-img>
    </v-container>
  </v-overlay>
</template>

<script>
import {useImagesStore} from "@/stores/imagesStore";
export default {
  props: {
    gallery_id: {
      type: [Number, String],
      required: true,
      default: 0,
    },
  },
  computed: {
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 4;
      }
    },
  },
  data() {
    const imagesStore = useImagesStore();
    return {
      imagesStore,
      images: Object,
      lightbox: false,
      selectedImage: null,
      wasMounted: false,
    }
  },
  watch: {
    imagesStore: {
      handler() {
        this.images = this.imagesStore.images;
      },
      deep: true,
    },
  },
  methods: {
    openLightbox(image) {
      this.selectedImage = image;
      this.lightbox = true;
    },
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `http://localhost/events/backend/public${value}`;
    },
  },
  beforeUpdate() {
    // if (!this.wasMounted) {
      this.imagesStore.init(this.gallery_id);
    // }
  },
  mounted() {
    this.imagesStore.init(this.gallery_id);
    this.wasMounted = true;
  },
  // created() {
  //   if (this.imagesStore.images.length === 0) {
  //     this.imagesStore.init(this.gallery_id);
  //   }
  // },
}
</script>

<style scoped>

</style>