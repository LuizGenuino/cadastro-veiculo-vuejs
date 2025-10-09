// Utilities
import type { UsuarioType } from '@/services/http/usuario/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuario = defineStore('usuario', () => {
    const state = ref<Partial<UsuarioType>>({})

    function get(): UsuarioType {
        return state.value as UsuarioType;
    }

    async function set(data: Partial<UsuarioType>) {
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
