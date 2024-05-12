<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-select
          :v-model="yy"
          :item-props="itemProps"
          :items="galleries"
          label="Year"
          ref="gallerySelector"
          @update:model-value="changeGallery"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :subtitle="item.raw.title"
          ></v-list-item>
        </template>
      </v-select>
      <h2 class="text-h2 mb-3">{{ gal?.title }}</h2>
      <GalleryImages :gallery_id="gal?.gallery_id" v-if="galleryId"/>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import PageHeader from "@/components/PageHeader.vue";
import {useGalleriesStore} from "@/stores/galleriesStore";
import GalleryImages from "@/components/GalleryImages.vue";

export default {
  components: {
    GalleryImages,
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  props: {
    year: {
      type: String,
      default: null,
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
    galleries() {
      return this.galleriesStore.galleries;
    },
    gal() {
      return this.galleriesStore.getGalleryByYear(this.yy);
    },
  },
  data() {
    const galleriesStore = useGalleriesStore();
    return {
      galleriesStore,
      yy: 0,
      galleryId: 0,
    }
  },
  watch: {
    galleriesStore: {
      handler() {
        if (this.year) {
          const gallery = this.galleriesStore.getGalleryByYear(this.year);
          if (gallery) {
            this.yy = parseInt(gallery.year);
            this.galleryId = gallery.gallery_id;
          } else {
            // this.yy = 0;
            // this.galleryId = 0;
          }
        } else {
          const currentGallery = this.galleriesStore.getCurrentGallery();
          if (currentGallery) {
            this.$router.push({name: 'gallery_year', params: {year: currentGallery.year}});
          } else {
            // this.yy = 0;
            // this.galleryId = 0;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    itemProps(item) {
      return {
        title: item.year,
        subtitle: item.title,
        value: item.value,
      };
    },
    changeGallery(year) {
      this.$router.push({name: 'gallery_year', params: {year: year}});
    },
  },
  mounted() {
    if (this.year) {
      const gallery = this.galleriesStore.getGalleryByYear(this.year);
      if (gallery) {
        this.yy = parseInt(gallery.year);
        this.galleryId = gallery.gallery_id;
      } else {
        const currentGallery = this.galleriesStore.getCurrentGallery();
        if (currentGallery) {
          this.yy = currentGallery.year;
          this.galleryId = currentGallery.gallery_id;
        } else {
          // this.yy = 0;
          // this.galleryId = 0;
        }
      }
    } else {
      const currentGallery = this.galleriesStore.getCurrentGallery();
      if (currentGallery) {
        this.$router.push({name: 'gallery_year', params: {year: currentGallery.year}});
      } else {
        // this.yy = 0;
        // this.galleryId = 0;
      }
    }
  },
  beforeUpdate() {
    if (this.year) {
      const gallery = this.galleriesStore.getGalleryByYear(this.year);
      if (gallery) {
        this.yy = parseInt(this.year);
        this.galleryId = gallery.gallery_id;
        document.title = `Gallery - ${gallery.title} - Web Dev 2024`;
      }
    } else {
      const currentGallery = this.galleriesStore.getCurrentGallery();
      if (currentGallery) {
        this.$router.push({name: 'gallery_year', params: {year: currentGallery.year}});
      } else {
        // this.yy = 0;
        // this.galleryId = 0;
      }
    }
  },
  created() {
    if (this.galleriesStore.galleries.length === 0) {
      this.galleriesStore.init();
    }
  },
};
</script>

<style>

</style>