<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-card
          class="mx-auto"
          max-width="100%"
          title="Personal account"
          variant="flat"
      >
        <v-container>
          <v-text-field
              v-model="name"
              color="primary"
              label="User name"
              variant="underlined"
              readonly
          ></v-text-field>

          <v-text-field
              v-model="first_name"
              color="primary"
              label="First name"
              variant="underlined"
              readonly
          ></v-text-field>

          <v-text-field
              v-model="last_name"
              color="primary"
              label="Last name"
              variant="underlined"
              readonly
          ></v-text-field>

          <v-text-field
              v-model="email"
              color="primary"
              label="Email"
              variant="underlined"
              type="email"
              readonly
          ></v-text-field>

<!--          <hr>-->

<!--          <v-select v-model="subscribe" :items="[1, 0]" label="Subscribe to current event"></v-select>-->
          <v-label>Subscribe to current event: {{ subscribe_bool }}</v-label>
          <v-switch v-model="subscribe_bool"></v-switch>
          <v-row v-if="errorMsg">
            {{ errorMsg }}
          </v-row>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" @click.prevent="saveForm">Save<v-icon icon="mdi-chevron-right" end></v-icon></v-btn>
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
import {inject} from "vue";

export default {
  components: {
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  data() {
    const userStore = inject('userStore');
    return {
      userStore,
      subscribe: 0,
      event_id: 0,
      user_id: 0,
      name: null,
      first_name: null,
      last_name: null,
      email: null,
      errorMsg: null,
    }
  },
  computed: {
    subscribe_bool: {
      get() {
        return this.subscribe === 1;
      },
      set(value) {
        this.subscribe = value ? 1 : 0;
      }
    }
  },
  watch: {
    userStore: {
      handler() {
        this.name = this.userStore.user.name;
        this.first_name = this.userStore.user.first_name;
        this.last_name = this.userStore.user.last_name;
        this.email = this.userStore.user.email;
      },
      deep: true,
    },
  },
  methods: {
    saveForm() {
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      axios.post('http://localhost/events/backend/public/api/update-subscribe', {
        subscribe: Number(this.subscribe),
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        }
      }).then((response) => {
        // this.$router.push({ name: 'account' });
        window.location.reload();
      }).catch((error) => {
        console.error('Error fetching data:', error);
        this.errorMsg = 'Error fetching data';
      });
    },
  },
  mounted() {
    if (this.userStore.user && this.userStore.user.hasOwnProperty('id')) {
      this.name = this.userStore.user.name;
      this.first_name = this.userStore.user.first_name;
      this.last_name = this.userStore.user.last_name;
      this.email = this.userStore.user.email;
    }
  },
  created() {
    axios.get(`http://localhost/events/backend/public/api/get-subscribe`).then(response => {
      if (response.data.hasOwnProperty('subscribe') && response.data.subscribe === 1) {
        this.subscribe = 1;
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
      this.errorMsg = 'Error fetching data';
    });
  },
};
</script>

<style>

</style>