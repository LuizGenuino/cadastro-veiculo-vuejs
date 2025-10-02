// Utilities
import { parseQueryParametersToData, transformDataToQueryParameters } from '@/utils/queryParameters'
import type { CadastroVeiculoType } from '@/utils/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useVeiculo = defineStore('veiculo', () => {
    const router = useRouter()
    const route = useRoute()
    const state = ref<CadastroVeiculoType>({
        etapa_concluida: null,
        uid: null,
        loja_usuario: '',
        placa_ou_chassi: '',
        nome_proprietario: '',
        telefone_proprietario: '',
        id_veiculo_fipe: '',
        chassi: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        valor_fipe: '',
        valorDesejado: 0,
        kmRodado: 0,
        estadoConservacao: '',
        motivoVenda: '',
        checklist: {},
        fotos_obrigatorias: {},
        fotos_opcionais: {}
    })

    function get(): CadastroVeiculoType {
        if (route.query && Object.keys(route.query).length > 0) {
            const queryData = parseQueryParametersToData(route.query);
            state.value = { ...state.value, ...queryData } as CadastroVeiculoType
        }
        return state.value
    }

    function set(data: Partial<CadastroVeiculoType>) {
        state.value = { ...state.value, ...data }
        const queryObj: Record<string, any> = transformDataToQueryParameters(state.value);
        router.replace({ query: queryObj });
    }

    return {
        get,
        set
    }
})
