import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useTestimonialsStore = defineStore('testimonialsStore',
    {
        state: () => ({
            testimonials: [],
        }),
        getters: {
            getTestimonials: (state) => state.testimonials,
        },
        actions: {
            fetchTestimonials() {
                // axios.get('/testimonials.json').then(response => {
                axios.get('http://localhost/events/backend/public/api/get-testimonials').then(response => {
                    this.$patch({
                        testimonials: response.data.testimonials,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchTestimonials();
            },
        }
    });