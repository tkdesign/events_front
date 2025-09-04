import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useImagesStore = defineStore('imagesStore', {
    state: () => ({
        images: [],
    }),
    getters: {
        getImages: (state) => () => { return state.images; },
        getImageById: (state) => (image_id) => {
            return state.images.find((image) => image.image_id === parseInt(image_id));
        },
    },
    actions: {
        fetchImages(galleryId) {
            axios.get(`/api/get-images/${galleryId}`).then(response => {
                this.$patch({
                    images: (response.data.images ? response.data.images : []),
                });
            }).catch(error => {
                console.error("Can't load data.", error);
            });
        },
        init(galleryId) {
            this.fetchImages(galleryId);
        },
    }
});