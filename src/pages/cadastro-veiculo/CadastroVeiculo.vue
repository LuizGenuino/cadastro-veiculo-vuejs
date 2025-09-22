<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import type { CadastroVeiculoType, SnackbarType } from '../../utils/types'

const showSnackbar = inject<SnackbarType>('snackbar', () => { });
const router = useRouter();


const form = reactive<CadastroVeiculoType>({
    placa_ou_chassi: '',
    nome_proprietario: '',
    telefone_proprietario: ''
});

const isFormValid = ref(false);
const isLoading = ref(false);


const validators = {
    required: (v: string) => !!v || 'Campo obrigatório',
};


async function onSubmit() {
    if (!isFormValid.value) {
        showSnackbar('Por favor, preencha os campos obrigatórios.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const veiculo = JSON.stringify([{ ...form, uid: '1' }, { ...form, uid: '2' }, { ...form, uid: '3' }]);

        const token = '123';



        showSnackbar('Veículo encontrado! Selecione a versão.', 'success')

        router.push({ path: `/selecionar-veiculo/${token}`, query: { veiculo } });

    } catch (error) {
        console.error('Falha ao buscar veículo:', error);
        showSnackbar('Não foi possível encontrar o veículo. Tente novamente.', 'error');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <v-form-card v-model:formVerification="isFormValid" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Informações básicas do veículo" submit-text="Cadastrar Veículo" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 1 de 4</v-card-subtitle>
        <v-row>
            <v-col cols="12">
                <v-id-vehicle-input v-model:model="form.placa_ou_chassi" :loading="isLoading" label="PLACA OU CHASSI*"
                    required />
            </v-col>

            <v-col cols="12">
                <v-text-field v-model="form.nome_proprietario" :readonly="isLoading" :loading="isLoading"
                    :rules="[validators.required]" label="NOME DO PROPRIETÁRIO*" variant="outlined"
                    prepend-inner-icon="mdi-account" />
            </v-col>

            <v-col cols="12">
                <v-phone-field v-model:model="form.telefone_proprietario" :loading="isLoading"
                    label="TELEFONE DO PROPRIETÁRIO*" required />
            </v-col>
        </v-row>
    </v-form-card>
</template>