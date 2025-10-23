// Utilities

import type { UsuarioDataType } from '@/services/http/usuario/types';
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuario = defineStore('usuario', () => {
    const state = ref<Partial<UsuarioDataType>>({})

    function get(): UsuarioDataType {
        return state.value as UsuarioDataType;
    }

    async function set(data: Partial<UsuarioDataType>) {
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
