/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { CadastroVeiculoRoute } from '@/pages/cadastro-veiculo/route'
import { NotFoundRoute } from '@/pages/not-found-page/route'
import { SelecionarVeiculoRoute } from '@/pages/selecionar-veiculo/route'
import { InformacaoVeiculoRoute } from '@/pages/informacao-veiculo/route'
import { ImagensVeiculoRoute } from '@/pages/imagens-veiculo/route'
import { ImagensOpcionaisVeiculoRoute } from '@/pages/imagens-opcionais-veiculo/route'
import { CadastroRepasseRoute } from '@/pages/cadastro-repasse/route'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        CadastroVeiculoRoute,
        SelecionarVeiculoRoute,
        InformacaoVeiculoRoute,
        ImagensVeiculoRoute,
        ImagensOpcionaisVeiculoRoute,
        CadastroRepasseRoute,
        // Not Found route should be the last one
        NotFoundRoute
    ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if (localStorage.getItem('vuetify:dynamic-reload')) {
            console.error('Dynamic import error, reloading page did not fix it', err)
        } else {
            console.log('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
        }
    } else {
        console.error(err)
    }
})

router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
