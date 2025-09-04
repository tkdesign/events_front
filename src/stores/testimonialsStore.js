import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

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
                axios.get('/api/get-testimonials').then(response => {
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