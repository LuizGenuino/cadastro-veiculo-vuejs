import type { RouteRecordRaw } from "vue-router";

export const ImagensVeiculoRoute: RouteRecordRaw = {
    path: '/imagens-veiculo/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
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
