import type { RouteRecordRaw } from "vue-router";

export const SelecionarVeiculoRoute: RouteRecordRaw = {
    path: '/selecionar-veiculo/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
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
