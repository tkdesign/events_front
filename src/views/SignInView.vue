<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field v-model="email" density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Password</div>

        <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"></v-text-field>

        <v-btn @click.prevent="login" class="mb-8" color="blue" size="large" variant="tonal" block>Log In</v-btn>
        <v-card-text class="text-center">
          <v-btn class="text-blue text-decoration-none" @click.prevent="goToSignUp" variant="text">
            Sign up with now
            <v-icon icon="mdi-chevron-right"></v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text class="text-center" v-if="errorMsg">
          {{ errorMsg }}
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import PageHeader from "@/components/PageHeader.vue";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  data() {
    return {
      visible: false,
      email: null,
      password: null,
      errorMsg: null,
    };
  },
  methods: {
    login() {
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;

      axios.get('/sanctum/csrf-cookie').then((response) => {
        axios.post('/login', {
          email: this.email,
          password: this.password,
        }, {
          headers: {
            Accept: 'application/json'
          }
        }).then(async (response) => {
          if (response.status === 200) {
            // this.$router.push('/account');
            window.location.href = '/account';
          } else {
            this.errorMsg = 'Invalid email or password';
          }
        }).catch((error) => {
          if (error.response && error.response.status === 422) {
            this.errorMsg = 'Invalid email or password';
          } else {
            this.errorMsg = 'An error occurred. Please try again later.';
          }
        });
      });
    },
    goToSignUp() {
      this.$router.push({ name: 'sign-up' });
    },
  },
};
</script>

<style>

</style>