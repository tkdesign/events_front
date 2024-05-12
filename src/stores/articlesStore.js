import {defineStore} from 'pinia'
import axios from 'axios';

export const useArticlesStore = defineStore('articlesStore',
    {
        state: () => ({
            articles: [],
        }),
        getters: {
            getArticles: (state) => state.articles,
            getArticleByMenuItemName: (state) => (menuItemName) => {
                return state.articles.find(article => article.menu_item_name === menuItemName);
            }
        },
        actions: {
            fetchArticles() {
                axios.get('/articles.json').then(response => {
                    this.$patch({
                        articles: response.data.articles,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchArticles();
            },
        }
    });