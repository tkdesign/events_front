import {defineStore} from 'pinia'
import axios from 'axios';

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
                axios.get('/testimonials.json').then(response => {
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