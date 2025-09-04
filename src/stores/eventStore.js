import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useEventStore = defineStore('eventStore',
    {
        state: () => ({
            event: Object,
        }),
        getters: {
            getEvent: (state) => state.event,
        },
        actions: {
            fetchEvent() {
                axios.get('/api/get-current-event').then(response => {
                    this.$patch({
                        event: response.data,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchEvent();
            },
        }
    });