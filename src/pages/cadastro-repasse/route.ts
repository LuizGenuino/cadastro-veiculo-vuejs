import type { RouteRecordRaw } from "vue-router";

export const CadastroRepasseRoute: RouteRecordRaw = {
    path: '/cadastro-repasse/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
    name: 'CadastroRepasse',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            name: 'CadastroRepassePage',
            component: () => import('@/pages/cadastro-repasse/CadastroRepasse.vue')
        }
    ]
}
