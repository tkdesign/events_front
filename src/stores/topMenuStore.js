import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useTopMenuStore = defineStore('topMenuStore',
    {
        state: () => ({
            menu: [],
            bottom_menu: [],
            admin_menu: [],
            routes: [],
            admin_routes: [],
        }),
        getters: {
            getMenu: (state) => state.menu,
            getBottomMenu: (state) => state.bottom_menu,
            getRoutes: (state) => state.routes,
        },
        actions: {
            fetchMenu() {
                axios.get('/api/get-menu').then(response => {
                    this.$patch({
                        menu: this.setMenu(response.data.menu, response.data.year),
                        bottom_menu: response.data.bottom_menu,
                        admin_menu: (response.data.hasOwnProperty('admin') ? response.data.admin : []),
                        routes: this.setRoutes(response.data),
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchMenu();
            },
            setMenu(menu, year) {
                // this.menu = menu;

                return menu.map(item => {
                    if (item.name === 'gallery') {
                        item.alias = `/gallery/${year}`;
                    }
                    return {
                        name: item.name,
                        title: item.title,
                        alias: item.alias.replace(/:.*/, ''),
                        type: item.type,
                    };
                });
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
            },
        }
    });