import type { RouteRecordRaw } from "vue-router";

export const ImagensOpcionaisVeiculoRoute: RouteRecordRaw = {
    path: '/imagens-opcionais/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
    name: 'ImagensOpcionaisVeiculo',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            name: 'ImagensOpcionaisVeiculoPage',
            component: () => import('@/pages/imagens-opcionais-veiculo/ImagensOpcionaisVeiculo.vue'),
        }
    ]
}
