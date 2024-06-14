<template>
  <v-row>
    <v-carousel
        :continuous="false"
        :show-arrows="false"
        height="500"
        hide-delimiter-background
    >
      <v-carousel-item :key="1" color="green lighten-3">
        <div class="d-flex h-100 justify-center flex-column">
          <v-container>
            <h6 class="text-h6 mb-5 pl-1">1 July 2024, <span>Nitra, Slovakia</span></h6>
            <h1 class="text-h1 mb-5">
              <small class="d-block p-2 h1-small pl-1">CONFERENCE</small>
              WEB DEV 2024</h1>
            <v-btn variant="outlined" class="mx-2" @click="goToSignUp" v-if="!checkAuth">Register Now</v-btn>
            <v-btn variant="outlined" class="mx-2" @click="goToEventDescription">Learn More</v-btn>
          </v-container>
        </div>
      </v-carousel-item>
      <v-carousel-item :key="2" color="blue lighten-3">
        <div class="d-flex h-100 justify-center flex-column">
          <v-container>
            <h6 class="text-h6 mb-5 pl-1">1 July 2024, <span>Nitra, Slovakia</span></h6>
            <h1 class="text-h1 mb-5">
              <small class="d-block p-2 h1-small pl-1">MASTERCLASS</small>
              LARAVEL API + VUE</h1>
            <v-btn variant="outlined" class="mx-2" @click="goToSignUp" v-if="!checkAuth">Register Now</v-btn>
            <v-btn variant="outlined" class="mx-2" @click="goToEventDescription">Learn More</v-btn>
          </v-container>
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-row>
</template>

<script>
import {inject} from "vue";
export default {
  data() {
    const userStore = inject('userStore');
    return {
      userStore,
    }
  },
  methods: {
    goToSignUp() {
      this.$router.push({ name: 'sign-up' });
    },
    goToEventDescription() {
      const element = document.getElementById('eventDescription');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    checkAuth() {
      return this.userStore.user && this.userStore.user.hasOwnProperty('id');
    },
  },
}
</script>

<style scoped>
.h1-small {
  font-size: 40%;
}
</style>