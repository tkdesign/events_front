import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useAdminMenuStore = defineStore('adminMenuStore',
    {
        state: () => ({
            adminMenu: [],
        }),
        getters: {
            getAdminMenu: (state) => state.adminMenu,
        },
        actions: {
            fetchAdminMenu() {
                // axios.get('/admin-menu.json').then(response => {
                axios.get('http://localhost/events/backend/public/api/admin/get-admin-menu').then(response => {
                    this.$patch({
                        adminMenu: response.data,
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchAdminMenu();
            },
        }
    });