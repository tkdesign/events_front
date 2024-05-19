import {defineStore} from 'pinia'
import axios from 'axios';

export const useCuratorsStore = defineStore('curatorsStore',
    {
        state: () => ({
            curators: [],
        }),
        getters: {
            getCurators: (state) => state.curators,
        },
        actions: {
            fetchCurators() {
                // axios.get('/curators.json').then(response => {
                axios.get('http://localhost/events/backend/public/api/get-curators').then(response => {
                    this.$patch({
                        curators: this.setCurators(response.data.curators),
                    });
                }).catch(error => {
                    console.error("Can't load data.", error);
                });
            },
            init() {
                this.fetchCurators();
            },
            setCurators(curators) {
                return curators.map(item => {
                    if (item.type === 'divider' || item.type === 'subheader') {
                        return item;
                    }
                    return {
                        image: item.image,
                        title: item.title,
                        role: item.role,
                        phone: item.phone,
                        email: item.email,
                        prependAvatar: item.image,
                        subtitle: `<div class="text-primary pt-2 pb-2">${item.role}</div><div class="pb-2">${item.phone}</div><div class="pb-2"><a class="link-light" href="mailto:${item.email}">${item.email}</a></div>`,
                    };
                });
            }

        }
    });