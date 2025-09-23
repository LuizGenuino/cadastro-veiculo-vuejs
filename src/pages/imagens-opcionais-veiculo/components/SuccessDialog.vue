<script setup lang="ts">
import { ref, defineProps, defineModel } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const isModalVisible = defineModel<boolean>('isModalVisible', { default: false });

function visualizarVeiculo() {
    const token = '123';

    router.push({ path: `/${token}` });
}

function cadastrarNovo() {
    const token = '123';

    router.push({ path: `/${token}` });
}

</script>


<template>
    <v-dialog v-model="isModalVisible" width="90%" max-width="500" class="pa-2" persistent>
        <v-card>
            <v-card-title class="d-flex justify-center align-center">
                Veiculo Cadastrado!
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-6 text-center">
                Você pode visualizar os detalhes do veículo ou cadastrar um novo.
            </v-card-text>
            <v-divider />

            <v-card-actions class="justify-space-between pa-4">
                <v-btn class="rounded-lg text-button" elevation="4" color="info" variant="flat" @click="visualizarVeiculo">Visualizar</v-btn>
                <v-btn class="rounded-lg text-button" elevation="4" color="warning" variant="flat" @click="cadastrarNovo">Cadastrar
                    Novo</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>