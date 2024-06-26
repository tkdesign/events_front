<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-select
          ref="gallerySelector"
          v-model="yy"
          :item-props="itemProps"
          :items="galleries"
          label="Year"
          @update:model-value="changeGallery"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item :subtitle="item.raw.title" v-bind="props"
          ></v-list-item>
        </template>
      </v-select>
      <h2 class="text-h2 mb-3">{{ selectedGallery?.title }}</h2>
      <GalleryImages v-if="galleryId" :gallery_id="galleryId"/>
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
    yy(newYear) {
      if (newYear) {
        this.$router.push({name: 'gallery', params: {year: newYear.toString()}});
      }
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
      if (this.galleriesStore.galleries.length > 0) {
        this.$nextTick(() => {
          this.$router.push({name: 'gallery', params: {year: year.toString()}});
        });
      }
    },
  },
  mounted() {
      this.galleriesStore.init();
  },
  beforeUpdate() {
      this.galleriesStore.init();
  },
};
</script>

<style>

</style>