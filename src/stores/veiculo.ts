// Utilities
import { parseQueryParametersToData, transformDataToQueryParameters } from '@/utils/queryParameters'
import type { CadastroVeiculoType } from '@/utils/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useVeiculo = defineStore('veiculo', () => {
    const router = useRouter()
    const route = useRoute()
    const state = ref<Partial<CadastroVeiculoType>>({})

    function get(): CadastroVeiculoType {
        if (route.query && Object.keys(route.query).length > 0) {
            const queryData = parseQueryParametersToData(route.query);
            const getKeys = Object.keys({ ...queryData, ...state.value });
            const mergedData = getKeys.reduce((acc, key) => {
                // const data = (queryData as any)[key] || (state.value as any)[key];
                (acc as any)[key] = (state.value as any)[key] || (queryData as any)[key];
                return acc;
            }, {} as CadastroVeiculoType);
            state.value = mergedData;

        } else {
            const queryObj: Record<string, any> = transformDataToQueryParameters(state.value);
            router.replace({ query: queryObj });
        }
        return state.value as CadastroVeiculoType;
    }

    async function set(data: Partial<CadastroVeiculoType>) {
        console.log(data);
        
        state.value = { ...state.value, ...data }
        const queryObj: Record<string, any> = transformDataToQueryParameters(state.value);
        await router.replace({ query: queryObj });
    }

    async function clear() {
        state.value = {}
        await router.replace({ query: {} });
    }

    return {
        get,
        set,
        clear
    }
})
