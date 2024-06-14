import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useSponsorsStore = defineStore('sponsorsStore', {
    state: () => ({
        sponsors: [],
    }),
    getters: {
        getSponsors: (state) => state.sponsors,
    },
    actions: {
        fetchSponsors() {
            // axios.get('/sponsors.json').then(response => {
            axios.get('http://localhost/events/backend/public/api/get-sponsors').then(response => {
                this.$patch({
                    sponsors: response.data.sponsors,
                });
            }).catch(error => {
                console.error("Can't load data.", error);
            });
        },
        init() {
            this.fetchSponsors();
        },
    }
});