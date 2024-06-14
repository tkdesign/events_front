<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-select
          v-model="yy"
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
      <h2 class="text-h2 mb-3">{{ selectedGallery?.title }}</h2>
      <GalleryImages :gallery_id="galleryId" v-if="galleryId"/>
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
    selectedGallery() {
      return this.galleriesStore.getGalleryByYear(this.yy);
    },
  },
  data() {
    const galleriesStore = useGalleriesStore();
    return {
      galleriesStore,
      yy: null,
      galleryId: null,
      wasMounted: false,
      wasCreated: false,
    }
  },
  watch: {
    galleriesStore: {
      handler() {
        const gallery = (this.year ? this.galleriesStore.getGalleryByYear(this.year) : this.galleriesStore.getCurrentGallery());
        if (gallery) {
          this.yy = gallery.year;
          this.galleryId = gallery.gallery_id;
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
    if (!this.galleriesStore.galleries.length) {
      if (!this.wasCreated) {
        this.galleriesStore.init();
      }
    } else {
      const gallery = (this.year ? this.galleriesStore.getGalleryByYear(this.year) : this.galleriesStore.getCurrentGallery());
      if (gallery) {
        this.yy = gallery.year;
        this.galleryId = gallery.gallery_id;
      }
    }
    this.wasMounted = true;
  },
  beforeUpdate() {
    if (!this.wasMounted) {
      this.galleriesStore.init();
    } else {
      const gallery = (this.year ? this.galleriesStore.getGalleryByYear(this.year) : this.galleriesStore.getCurrentGallery());
      if (gallery) {
        this.yy = gallery.year;
        this.galleryId = gallery.gallery_id;
      }
    }
  },
  created() {
    if (this.galleriesStore.galleries.length === 0) {
      this.galleriesStore.init();
    }
    this.wasCreated = true;
  },
};
</script>

<style>

</style>