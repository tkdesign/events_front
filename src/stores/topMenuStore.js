import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useTopMenuStore = defineStore('topMenuStore',
    {
        state: () => ({
            menu: [],
            bottom_menu: [],
            routes: [],
        }),
        getters: {
            getMenu: (state) => state.menu,
            getBottomMenu: (state) => state.bottom_menu,
            getRoutes: (state) => state.routes,
        },
        actions: {
            fetchMenu() {
                // axios.get('/menu.json').then(response => {
                axios.get('http://localhost/events/backend/public/api/get-menu').then(response => {
                    this.$patch({
                        menu: response.data.menu,
                        bottom_menu: response.data.bottom_menu,
                        routes: this.setRoutes(response.data),
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchMenu();
            },
            setMenu(menu) {
                this.menu = menu;
            },
            setRoutes(data) {
                const allItems = [...data.menu, ...data.bottom_menu];

                const menuItems = allItems.filter(item => item.type !== 'subheader' && item.type !== 'divider');

                return menuItems.map(item => {
                    const hasPathParams = /:/.test(item.alias);
                    return {
                        name: item.name,
                        path: item.alias,
                        component: () => import(`@/views/${item.component}.vue`),
                        props: hasPathParams,
                        meta: {
                            title: item.title,
                        },
                    };
                });
            }
        }
    });