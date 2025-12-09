<script setup lang="ts">

import type { CadastroVeiculoType } from '@/stores/types';
import { useVeiculo } from '@/stores/veiculo';


const props = defineProps<{
    form?: Partial<CadastroVeiculoType>
}>()

const isModalVisible = defineModel<boolean>('isModalVisible', { default: false });

function visualizarVeiculo() {
    useVeiculo().clear()
    window.open(`https://app.pitom.com.br/avaliacao/${props.form?.key_uid}`, '_parent');
}

function visualizarRepasse() {
    useVeiculo().clear()
    window.open(`https://app.pitom.com.br/repasse/veiculos/${props.form?.key_uid}`, '_parent');
}

function cadastrarNovo() {
    useVeiculo().clear()
}

function fechar() {
    useVeiculo().clear()
    window.open('https://app.pitom.com.br/avaliacoes', '_parent');
}



</script>


<template>
    <v-dialog v-model="isModalVisible" width="90%" max-width="500" class="pa-2" persistent>
        <v-card>
            <v-card-title class="d-flex justify-center align-center">
                Repasse Cadastrado!
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-6 text-center">
                Você pode visualizar os detalhes do veículo em Avaliação ou Repasse cadastrar um novo.
            </v-card-text>
            <v-divider />

            <v-card-actions class="d-flex justify-space-between pa-4">
                <v-btn class="rounded-lg text-button" elevation="4" color="success" variant="flat"
                    @click="visualizarVeiculo">
                    Avaliação
                </v-btn>

                 <v-btn class="rounded-lg text-button" elevation="4" color="info" variant="flat"
                    @click="visualizarRepasse">
                    Repasse
                </v-btn>

                <v-btn class="rounded-lg text-button" elevation="4" color="warning" variant="flat"
                    @click="cadastrarNovo">
                    Cadastrar
                </v-btn>

                <v-btn class="rounded-lg text-button" elevation="4" color="error" variant="flat" @click="fechar">
                    Fechar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>