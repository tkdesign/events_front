import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useBannersStore = defineStore('bannersStore',
    {
        state: () => ({
            banners: [],
        }),
        getters: {
            getBanners: (state) => state.banners,
        },
        actions: {
            fetchBanners() {
                axios.get('http://localhost/events/backend/public/api/get-banners').then(response => {
                    this.$patch({
                        banners: response.data.banners,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchBanners();
            },
        }
    });