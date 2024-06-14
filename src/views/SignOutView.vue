<template>
  <div>Logging out...</div>
</template>

<style scoped>

</style>

<script>
import axios from "axios";
export default {
  created() {
    axios.post('http://localhost/events/backend/public/logout')
        .then(() => {
          // const userStore = useUserStore();
          // userStore.setUser(null);
          this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
          delete axios.defaults.headers.common['X-Xsrf-Token'];

          window.location.href = '/';
        })
        .catch((error) => {
          console.error(error);
        });
  }
}
</script>
