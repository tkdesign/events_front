import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

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
                axios.get('/api/admin/get-admin-menu').then(response => {
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