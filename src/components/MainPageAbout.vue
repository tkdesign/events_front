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
            <h4 class="text-h4">About the event</h4>
            <div>
              This is a conference for web developers. We will have a lot of interesting speakers and workshops. You can learn a lot of new things and meet new people. We will have a lot of fun and you will not regret coming to our event.
            </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="cols">
          <v-card
              height="280"
          >
            <v-card-title>Who we are?</v-card-title>
            <v-card-text>
              We are a group of web developers who love to code and share our knowledge with others. We organize events like this conference to help other developers learn new things and improve their skills. We believe that sharing knowledge is the best way to grow as a developer.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="cols">
          <v-card
              height="280"
          >
            <v-card-title>Why you should come?</v-card-title>
            <v-card-text>
              If you are a web developer who wants to learn new things and improve your skills, this conference is for you. We will have a lot of interesting speakers and workshops where you can learn new technologies and techniques. You will also have the opportunity to meet other developers and share your knowledge with them. So don't miss this opportunity to grow as a developer and have a lot of fun.
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