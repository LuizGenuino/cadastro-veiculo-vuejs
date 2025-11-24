// Utilities

import type { ResponseUsuarioType } from '@/services/http/usuario/types';
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuario = defineStore('usuario', () => {
    const state = ref<Partial<ResponseUsuarioType>>({})

    function get(): ResponseUsuarioType {
        return state.value as ResponseUsuarioType;
    }

    async function set(data: Partial<ResponseUsuarioType>) {
        state.value = { ...state.value, ...data }
    }

    async function clear() {
        state.value = {}

    }

    return {
        get,
        set,
        clear
    }
})
