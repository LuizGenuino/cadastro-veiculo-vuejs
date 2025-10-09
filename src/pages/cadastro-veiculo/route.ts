import type { RouteRecordRaw } from "vue-router";

export const CadastroVeiculoRoute: RouteRecordRaw = {
    path: '/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
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
