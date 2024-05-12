import {defineStore} from 'pinia'
import axios from 'axios';

export const useGalleriesStore = defineStore('galleriesStore', {
    state: () => ({
        galleries: [],
    }),
    getters: {
        getGalleries: (state) => state.galleries,
        getGalleryById: (state) => (gallery_id) => {
            return state.galleries.find((gallery) => gallery.gallery_id === parseInt(gallery_id));
        },
        getGalleryByYear: (state) => (year) => {
            return state.galleries.find((gallery) => gallery.year === parseInt(year));
        },
        getCurrentGallery: (state) => () => {
            return state.galleries.find((gallery) => gallery.is_current === true);
        },
    },
    actions: {
        fetchGalleries() {
            axios.get('/galleries.json').then(response => {
                this.$patch({
                    galleries: response.data.galleries,
                });
            }).catch(error => {
                console.error("Can't load data.", error);
            });
        },
        init() {
            this.fetchGalleries();
        },
    }
});