import type { RouteRecordRaw } from "vue-router";

export const ImagensVeiculoRoute: RouteRecordRaw = {
    path: '/imagens-veiculo/:token([0-9a-fA-F-]{3})',
    name: 'ImagensVeiculo',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            name: 'ImagensVeiculoPage',
            component: () => import('@/pages/imagens-veiculo/ImagensVeiculo.vue'),
        }
    ]
}
