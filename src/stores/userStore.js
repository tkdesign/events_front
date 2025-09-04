import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,      // было []
    status: false
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    async fetchUser() {
      try {
        const { data } = await axios.get('/api/user');
        this.$patch({
          user: (data && 'user' in data) ? data.user : null,
          status: !!(data && data.status)
        });
        return data;
      } catch (e) {
        console.error("Can't load user.", e);
        this.$patch({ user: null, status: false });
        throw e;
      }
    },
    init() {
      return this.fetchUser();
    },
  }
});
