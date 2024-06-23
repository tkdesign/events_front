<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-card
          class="mx-auto"
          max-width="100%"
          title="User Registration"
          variant="flat"
      >
        <v-container>
          <v-text-field
              v-model="name"
              color="primary"
              label="User name"
              variant="underlined"
          ></v-text-field>

          <v-text-field
              v-model="first_name"
              color="primary"
              label="First name"
              variant="underlined"
          ></v-text-field>

          <v-text-field
              v-model="last_name"
              color="primary"
              label="Last name"
              variant="underlined"
          ></v-text-field>

          <v-text-field
              v-model="email"
              color="primary"
              label="Email"
              variant="underlined"
              type="email"
          ></v-text-field>

          <v-text-field
              v-model="password"
              color="primary"
              label="Password"
              placeholder="Enter your password"
              variant="underlined"
              type="password"
          ></v-text-field>

          <v-checkbox
              v-model="terms"
              color="secondary"
              label="I agree to site terms and conditions"
          ></v-checkbox>
          <v-row v-if="errorMsg">
            {{ errorMsg }}
          </v-row>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" @click.prevent="signup">
            Complete Registration

            <v-icon icon="mdi-chevron-right" end></v-icon>
          </v-btn>
        </v-card-actions>
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

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  data() {
    return {
      name: null,
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      terms: false,
      errorMsg: null,
    }
  },
  methods: {
    signup() {
      if (!this.first_name || !this.last_name || !this.email || !this.password) {
        this.errorMsg = 'Please fill in all fields';
        return;
      }

      if (!this.terms) {
        this.errorMsg = 'Please agree to the terms and conditions';
        return;
      }
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      axios.get('http://localhost/events/backend/public/sanctum/csrf-cookie').then(
          (response) => {
            axios.post('http://localhost/events/backend/public/api/register', {
              name: this.name,
              first_name: this.first_name,
              last_name: this.last_name,
              email: this.email,
              password: this.password,
            }).then((response) => {
              if (response.status === 200) {
                this.$router.push('/sign-in');
                window.location.href = '/sign-in';

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
          }
      );
    },
  },
};
</script>

<style>

</style>