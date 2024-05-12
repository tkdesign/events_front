<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-card
          class="mx-auto pa-12 pb-8"
          elevation="8"
          max-width="448"
          rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password

<!--          <RouterLink
              class="text-caption text-decoration-none text-blue"
              :to="{ name: 'forgot-password' }"
          >
            Forgot login password?</RouterLink>-->
        </div>

        <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-card
            class="mb-12"
            color="surface-variant"
            variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            If you must login now, you can also click "Forgot login password?" below to reset the login password.
          </v-card-text>
        </v-card>

        <v-btn
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            block
        >
          Log In
        </v-btn>

        <v-card-text class="text-center">
          <RouterLink
              class="text-blue text-decoration-none"
              :to="{ name: 'sign-up' }"
          >
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </RouterLink>
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
export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>

<style>

</style>