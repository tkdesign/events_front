import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useSpeakersStore = defineStore('speakersStore',
    {
        state: () => ({
            speakers: [],
        }),
        getters: {
            getSpeakers: (state) => state.speakers,
        },
        actions: {
            fetchSpeakers() {
                axios.get('/api/get-speakers').then(response => {
                    this.$patch({
                        speakers: response.data.speakers,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchSpeakers();
            },
        }
    });