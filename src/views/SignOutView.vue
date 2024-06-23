<template>
  <div>Logging out...</div>
</template>

<style scoped>

</style>

<script>
import axios from "axios";
export default {
  created() {
    // axios.defaults.withCredentials = true;
    // axios.defaults.withXSRFToken = true;
    axios.post('http://localhost/events/backend/public/logout')
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
