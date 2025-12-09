import { useUsuario } from "@/stores/usuario";
import { useVeiculo } from "@/stores/veiculo";
import type { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric, Router, RouteRecordRaw } from "vue-router";

export const CadastroRepasseRoute: RouteRecordRaw = {
    path: '/cadastro-repasse/:token([A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+)',
    name: 'CadastroRepasse',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
        middlewares: [repasseMiddleware],
    },
    children: [
        {
            path: '',
            name: 'CadastroRepassePage',
            component: () => import('@/pages/cadastro-repasse/CadastroRepasse.vue')
        }
    ]
}

type Input = {
    next: NavigationGuardNext
    router: Router
    from: RouteLocationNormalizedLoadedGeneric
    to: RouteLocationNormalizedGeneric
}

async function repasseMiddleware({ next, router }: Input) {
    console.log('Repasse Middleware - Verificando permissão de repasse');
    const veiculo = useVeiculo().get();
    const repasse = useUsuario().repasse();
    console.log('Repasse Middleware - Repasse:', repasse, 'Veículo:', veiculo.repasse);
    if (repasse === false && veiculo.repasse !== true) {
        return router.back();
    }

    return next()
}
