import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useUserStore = defineStore('userStore',
    {
        state: () => ({
            user: [],
            status: false
        }),
        getters: {
            getUser: (state) => state.user,
        },
        actions: {
            fetchUser() {
                axios.get('http://localhost/events/backend/public/api/user').then(response => {
                    this.$patch({
                        user: (response.data.hasOwnProperty('user') ? response.data.user : []),
                        status: (response.data.hasOwnProperty('status') && !!response.data.status)
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchUser();
            },
        }
    });