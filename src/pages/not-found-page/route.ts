import type { RouteRecordRaw } from "vue-router";

export const NotFoundRoute: RouteRecordRaw = {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/not-found-page/NotFound.vue'),
}
