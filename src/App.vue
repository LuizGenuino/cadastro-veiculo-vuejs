<script  lang="ts" setup>
import { ref, provide } from 'vue'
const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
    icon: 'mdi-check-circle'
})

const showSnackbar = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
) => {
    const config = {
        success: { color: 'success', icon: 'mdi-check-circle' },
        error: { color: 'error', icon: 'mdi-alert-circle' },
        warning: { color: 'warning', icon: 'mdi-alert' },
        info: { color: 'info', icon: 'mdi-information' }
    }

    snackbar.value = {
        show: true,
        message,
        ...config[type]
    }
}

// Dados globais do veículo
const vehicleData = ref({
    placa: '',
    proprietario: '',
    telefone: '',
    versaoSelecionada: null,
    valor: '',
    km: '',
    conservacao: '',
    motivoVenda: '',
    informacoes: {},
    fotosObrigatorias: {},
    fotosOpcionais: {}
})

provide('snackbar', showSnackbar)
provide('vehicleData', vehicleData)
</script>


<template>
    <v-app>
        <v-main class="app-background">
            <v-container fluid class="pa-0">
                <router-view />
            </v-container>
        </v-main>

        <!-- Snackbar para feedback -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top" class="ios-snackbar">
            <div class="d-flex align-center">
                <v-icon class="me-2">{{ snackbar.icon }}</v-icon>
                {{ snackbar.message }}
            </div>
        </v-snackbar>
    </v-app>
</template>
