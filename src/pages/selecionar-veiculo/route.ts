import type { RouteRecordRaw } from "vue-router";

export const SelecionarVeiculoRoute: RouteRecordRaw = {
    path: '/selecionar-veiculo/:token([0-9a-fA-F-]{3})',
    name: 'SelecionarVeiculo',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            name: 'SelecionarVeiculoPage',
            component: () => import('@/pages/selecionar-veiculo/SelecionarVeiculo.vue')
        }
    ]
}
