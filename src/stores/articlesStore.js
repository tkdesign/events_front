import {defineStore} from 'pinia'
import axios from 'axios';

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
                // axios.get('/articles.json').then(response => {
                axios.get(`http://localhost/events/backend/public/api/get-article/${menuItemName}`).then(response => {
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