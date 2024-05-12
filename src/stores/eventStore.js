import {defineStore} from 'pinia'
import axios from 'axios';

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
                axios.get('/event.json').then(response => {
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