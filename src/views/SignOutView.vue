<template>
  <div>Logging out...</div>
</template>

<style scoped>

</style>

<script>
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default {
  created() {
    // axios.defaults.withCredentials = true;
    // axios.defaults.withXSRFToken = true;
    axios.post('/logout')
        .then(() => {
          this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
          delete axios.defaults.headers.common['X-Xsrf-Token'];
          // this.$router.push({ name: 'home' });
          window.location.href = '/';
        })
        .catch((error) => {
          console.error(error);
        });
  }
}
</script>
