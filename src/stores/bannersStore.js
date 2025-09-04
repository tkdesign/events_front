import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

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
                axios.get('/api/get-banners').then(response => {
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