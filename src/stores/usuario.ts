// Utilities

import type { ResponseUsuarioType } from '@/services/http/usuario/types';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ROLE_PERMISSOES } from './types';

export const useUsuario = defineStore('usuario', () => {
    const state = ref<Partial<ResponseUsuarioType>>({})
    const repassePermitido = ref<boolean>(false);

    function get(): ResponseUsuarioType {
        return state.value as ResponseUsuarioType;
    }

    function repasse(): boolean {
        repassePermitido.value = ROLE_PERMISSOES.includes(state.value.profile || "")
        return repassePermitido.value;
    }

    async function set(data: Partial<ResponseUsuarioType>) {
        state.value = { ...state.value, ...data }
    }

    async function clear() {
        state.value = {}

    }

    return {
        get,
        repasse,
        set,
        clear
    }
})
