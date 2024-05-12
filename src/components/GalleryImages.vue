<template>
  <v-row>
    <v-col
        v-for="(image,n) in images"
        :key="n"
        class="d-flex child-flex"
        :cols="cols"
    >
      <v-img
          :lazy-src="image.thumbnail"
          :src="image.image"
          :key="image.image_id"
          aspect-ratio="1"
          class="bg-grey-lighten-2"
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
            :src="selectedImage.image"
            aspect-ratio="1"
            class="bg-grey-lighten-2"
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
      images: [],
      wasMounted: false,
      wasCreated: false,
      lightbox: false,
      selectedImage: null,
    }
  },
  watch: {
    imagesStore: {
      handler() {
        if (this.gallery_id) {
          this.images = this.imagesStore.getImages();
        } else {
          this.images = [];
        }
      },
      deep: true,
    },
  },
  methods: {
    openLightbox(image) {
      this.selectedImage = image;
      this.lightbox = true;
    },
  },
  mounted() {
    if (!this.imagesStore.images.length) {
      if (!this.wasCreated) {
        this.imagesStore.init(this.gallery_id);
      }
    } else {
      this.images = this.imagesStore.getImages();
    }
    this.wasMounted = true;
  },
  beforeUpdate() {
    if (!this.wasMounted) {
      this.imagesStore.init(this.gallery_id);
    } else {
      this.images = this.imagesStore.getImages();
    }
    this.wasMounted = false;
  },
  created() {
    if (this.imagesStore.images.length === 0) {
      this.imagesStore.init(this.gallery_id);
    }
    this.wasCreated = true;
  },
}
</script>

<style scoped>

</style>