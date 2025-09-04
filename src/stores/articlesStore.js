import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useArticlesStore = defineStore('articlesStore',
    {
        state: () => ({
            article: Object,
        }),
        getters: {
            getArticle: (state) => state.article,
        },
        actions: {
            fetchArticle(menuItemName) {
                axios.get(`/api/get-article/${menuItemName}`).then(response => {
                    this.$patch({
                        article: response.data,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init(menuItemName) {
                this.fetchArticle(menuItemName);
            },
        }
    });