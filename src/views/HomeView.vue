<template>
  <BaseHeader/>
  <v-main>
    <MainPageHeader/>
    <v-container class="mt-15 mb-10">
      <MainPageAbout id="eventDescription"/>
      <v-divider class="mt-15 mb-15"></v-divider>
      <MainPageTestimonials/>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import MainPageHeader from "@/components/MainPageHeader.vue";
import MainPageAbout from "@/components/MainPageAbout.vue";
import MainPageTestimonials from "@/components/MainPageTestimonials.vue";

export default {
  components: {
    MainPageTestimonials,
    MainPageAbout,
    MainPageHeader,
    BaseHeader,
    BaseFooter,
  }
};
</script>

<style>

</style>