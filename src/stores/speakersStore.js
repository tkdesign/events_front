import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
                // axios.get('/speakers.json').then(response => {
                axios.get('http://localhost/events/backend/public/api/get-speakers').then(response => {
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