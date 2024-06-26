import {createRouter, createWebHistory} from 'vue-router';
import {useTopMenuStore} from "@/stores/topMenuStore.js";
import {useEventStore} from "@/stores/eventStore.js";
import {useUserStore} from "@/stores/userStore.js";

export function createMyRouter() {

    const topMenuStore = useTopMenuStore();
    if (topMenuStore.routes.length === 0) {
        topMenuStore.init();
    }
    const eventStore = useEventStore();
    if (!eventStore.event || !eventStore.event.hasOwnProperty('event_id')) {
        eventStore.init();
    }
    const userStore = useUserStore();
    if (!userStore.user || !userStore.user.hasOwnProperty('id')) {
        userStore.init();
    }

    function convertPathToComponentName(path) {
        path = path.replace(/^\/|\/$/g, '');
        const hasPathParams = /:/.test(path);
        if (hasPathParams) {
            path = path.replace(/\/:.*$/g, '');
        }
        let parts = path.split(/[-\/]/);
        parts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
        return parts.join('') + 'View';
    }

    const currentPath = window.location.pathname;
    const defaultRoute = {
        name: "home",
        path: '/',
        component: () => import(`@/views/HomeView.vue`),
        meta: {title: 'Home'}
    };
    const notFoundRoute = {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {title: 'Not Found'}
    };
    let initialRoutes = [defaultRoute, notFoundRoute];
    if (currentPath !== '/') {
        const hasPathParams = /:/.test(currentPath);
        const dynamicRoute = {
            name: (hasPathParams ? currentPath.slice(1).replace(/\/:.*$/g, '') : currentPath.slice(1)),
            path: currentPath,
            props: hasPathParams,
            component: () => import(`@/views/${convertPathToComponentName(currentPath.slice(1))}.vue`).catch(() => import('@/views/NotFoundView.vue')),
        };
        initialRoutes.unshift(dynamicRoute);
    }

    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: initialRoutes,
    });

    topMenuStore.$subscribe((mutation, state) => {
        if (mutation.type === 'patch object' && mutation.payload.hasOwnProperty('routes')) {
            const currentRoute = window.location.pathname;
            router.getRoutes().forEach((route) => {
                router.removeRoute(route.name);
            });
            state.routes.forEach((route) => {
                router.addRoute(route);
                if (route.name === 'admin') {
                    state.admin_menu.forEach((menu_item) => {
                        if (!router.hasRoute(menu_item.path)) {
                            const hasPathParams = /:/.test(menu_item.alias);
                            const r = {
                                name: menu_item.name,
                                path: menu_item.router_link,
                                component: () => import(`@/views/${menu_item.component}.vue`),
                                props: hasPathParams,
                                meta: {
                                    title: menu_item.title,
                                },
                            };
                            router.addRoute('admin', r);
                        }
                    });
                }
            });
            // router.addRoute(notFoundRoute);
            router.replace(currentRoute).then(() => {
            });
        }
    });

    router.beforeEach((to, from, next) => {
        if (to.meta?.title) {
            if (!to.path.startsWith('/gallery')) {
                document.title = to.meta.title + ' - WEB DEV 2024';
            }
        } else {
            document.title = 'WEB DEV 2024';
        }
        next();
    });

    return router;
}
