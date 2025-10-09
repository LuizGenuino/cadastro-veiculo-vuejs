import type { RouteRecordRaw } from "vue-router";

export const InformacaoVeiculoRoute: RouteRecordRaw = {
    path: '/informacao-veiculo/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
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
