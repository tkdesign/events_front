<template>
  <div style="font-style: italic;">{{ testimonial.desc }}</div>
  <v-rating
      readonly
      v-model="testimonial.rating"
      class="mt-3"
      density="compact"
  ></v-rating>
  <div class="text-h6 mt-2">{{ makeFullName(testimonial) }}</div>
</template>

<script>
export default {
  props: {
    testimonial: {
      type: Object,
      required: true,
    },
  },
  methods: {
    makeFullName(testimonial) {
      if (!testimonial) {
        return '';
      }
      return [testimonial.first_name, testimonial.last_name].join(' ');
    },
  },
}
</script>

<style scoped>

</style>