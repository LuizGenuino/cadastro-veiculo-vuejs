// Utilities
import { defineStore } from 'pinia'

export const useLoading = defineStore('loading', () => {
    const state = ref({
        isLoading: false,
        dialog: false,
        title: 'Aguarde',
        message: 'Carregando...',
    })

    function showDialog(message: string = "Carregando...", title: string = "Aguarde") {
        state.value.message = message
        state.value.title = title
        state.value.dialog = true
        state.value.isLoading = true
    }

    function hidden() {
        state.value.dialog = false
        state.value.isLoading = false
    }

    function isLoading() {
        return state.value.isLoading
    }

    return {
        state,
        show: showDialog,
        hidden,
        isLoading
    }
})
