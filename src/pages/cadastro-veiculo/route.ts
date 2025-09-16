import type { RouteRecordRaw } from "vue-router";

export const CadastroVeiculoRoute: RouteRecordRaw = {
    path: '/:token([0-9a-fA-F-]{3})',
    name: 'CadastroVeiculo',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            name: 'CadastroVeiculoPage',
            component: () => import('@/pages/cadastro-veiculo/CadastroVeiculo.vue')
        }
    ]
}
