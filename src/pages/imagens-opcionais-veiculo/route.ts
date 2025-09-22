import type { RouteRecordRaw } from "vue-router";

export const ImagensOpcionaisVeiculoRoute: RouteRecordRaw = {
    path: '/imagens-opcionais/:token([0-9a-fA-F-]{3})',
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
