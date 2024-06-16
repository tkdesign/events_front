<template>
<!--  <BaseHeader :currentPage="'/notfound'"/>-->
  <BaseHeader/>
  <v-container class="mt-15 mb-10">
    <v-empty-state
        headline="Whoops, 404"
        title="Page not found"
        text="The page you were looking for does not exist"
        image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
    ></v-empty-state>
  </v-container>
<!--  <BaseFooter :currentPage="'/notfound'"/>-->
  <BaseFooter/>
</template>

<script>
import {defineComponent} from "vue";
import BaseHeader from "@/components/BaseHeader.vue";
import BaseFooter from "@/components/BaseFooter.vue";

export default defineComponent({
  components: {BaseFooter, BaseHeader}
})
</script>

<style scoped>

</style>