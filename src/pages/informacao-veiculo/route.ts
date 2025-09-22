import type { RouteRecordRaw } from "vue-router";

export const InformacaoVeiculoRoute: RouteRecordRaw = {
    path: '/informacao-veiculo/:token([0-9a-fA-F-]{3})',
    name: 'InformacaoVeiculo',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            name: 'InformacaoVeiculoPage',
            component: () => import('@/pages/informacao-veiculo/InformacaoVeiculo.vue'),
        }
    ]
}
