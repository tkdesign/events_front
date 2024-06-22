<template>
  <v-row>
    <v-col :cols="cols">
      <v-img
        cover
        height="418px"
        src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
      ></v-img>
    </v-col>
    <v-col :cols="cols">
      <v-row>
        <v-col cols="12">
            <h4 class="text-h4">A FEW WORDS ABOUT THE NCONNECT CONFERENCE</h4>
            <div>
              After years of thinking and planning, we created nConnect, a unique event in Nitra that brings together IT students and leading companies in this dynamic industry. The nConnect conference follows the long tradition of the "IT in Practice" format of the Constantine the Philosopher University in Nitra. This initiative is a bridge between a new generation of talent and experienced professionals, providing a platform for exchange of ideas and inspiration for each other. Our mission was clear: to fill the gap in local IT communication and collaboration, and nConnect is the proud result of this vision.
            </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="cols">
          <v-card

          >
            <v-card-title>WHO WE ARE?</v-card-title>
            <v-card-text>
              We are a group of IT enthusiasts from the academic and business communities.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="cols">
          <v-card

          >
            <v-card-title>WHAT DO WE WANT?</v-card-title>
            <v-card-text>
              To create an event that will bring together the IT community in Nitra on a regular basis.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 6;
      }
    },
  },
}
</script>

<style scoped>

</style>