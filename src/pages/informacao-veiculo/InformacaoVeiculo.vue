<script setup lang="ts">
import { PERGUNTAS, type FormStateType, type SnackbarType } from '@/utils/types';
import { ref, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'


const ESTADOS_CONSERVACAO = [
    'Excelente', 'Muito Bom', 'Bom', 'Regular', 'Precisa de Reparos'
];

const MOTIVOS_VENDA = [
    'Troca por outro veículo', 'Necessidade financeira', 'Mudança de cidade',
    'Não uso mais', 'Upgrade de modelo', 'Outros'
];




const showSnackbar = inject<SnackbarType>('snackbar', () => { });
const router = useRouter();

const formState = reactive<FormStateType>({
    valorDesejado: null,
    kmRodado: null,
    estadoConservacao: '',
    motivoVenda: '',

    checklist: PERGUNTAS.reduce((acc, pergunta) => {
        acc[pergunta.key] = null;
        return acc;
    }, {} as FormStateType['checklist'])
});

const isLoading = ref(false);

const isBasicFormValid = ref(false);


const validators = {
    required: (v: any) => !!v || 'Campo obrigatório',
    numeric: (v: string) => !isNaN(parseFloat(v)) && isFinite(Number(v)) || 'Deve ser um número',
};


const areAllQuestionsAnswered = computed(() => {
    return PERGUNTAS.every(pergunta => formState.checklist[pergunta.key] !== null);
});


const isFormCompletelyValid = computed(() => {
    return isBasicFormValid.value && areAllQuestionsAnswered.value;
});


async function onSubmit() {
    if (!isFormCompletelyValid.value) {
        showSnackbar('Por favor, preencha todos os campos e responda a todas as perguntas.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Dados a serem salvos:', formState);
        showSnackbar('Informações salvas com sucesso!', 'success');

        const token = '123';

        router.push({ path: `/imagens-veiculo/${token}` });

    } catch (error) {
        console.error("Erro ao salvar informações:", error);
        showSnackbar('Ocorreu um erro ao salvar os dados.', 'error');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <v-form-card v-model:formVerification="isBasicFormValid" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Complete os dados adicionais" submit-text="Proximo"
        :is-submit-disabled="!isFormCompletelyValid" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 2 de 4</v-card-subtitle>
        <v-row>
            <v-col cols="12" md="6">
                <v-currency-field v-model.number="formState.valorDesejado" :readonly="isLoading" label="VALOR DESEJADO*"
                    required prefix="R$" currency/>
            </v-col>

            <v-col cols="12" md="6">
                <v-currency-field v-model.number="formState.kmRodado" :readonly="isLoading" label="KM RODADO*"
                    suffix="KM" required />
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formState.estadoConservacao" label="ESTADO DE CONSERVAÇÃO*"
                    :items="ESTADOS_CONSERVACAO" variant="outlined" :readonly="isLoading"
                    :rules="[validators.required]" />
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formState.motivoVenda" label="MOTIVO DA VENDA*" :items="MOTIVOS_VENDA"
                    :readonly="isLoading" :rules="[validators.required]" variant="outlined" />
            </v-col>
        </v-row>

        <v-divider class="my-6" />

        <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center">
            <v-icon color="primary" class="me-2">mdi-clipboard-check-outline</v-icon>
            Checklist do Veículo
        </h3>
        <div class="extra-info-grid">
            <div v-for="pergunta in PERGUNTAS" :key="pergunta.key">
                <v-card class="question-card" variant="outlined" border="opacity-50 sm">
                    <p class="question-text mb-3">{{ pergunta.texto }}</p>
                    <v-btn-toggle v-model="formState.checklist[pergunta.key]" variant="outlined" divided mandatory
                        class="w-100">
                        <v-btn color="primary" value="sim" class="flex-grow-1">
                            <v-icon start>mdi-check</v-icon>
                            Sim
                        </v-btn>
                        <v-btn color="error" value="nao" class="flex-grow-1">
                            <v-icon start>mdi-close</v-icon>
                            Não
                        </v-btn>
                    </v-btn-toggle>
                </v-card>
            </div>
        </div>
    </v-form-card>
</template>

<style scoped>
.question-card {
    border-radius: 12px;
    padding: 16px;
    background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.question-text {
    font-weight: 500;
    font-size: 0.9rem;
}

.extra-info-grid {
    display: grid;
    gap: 16px;
}

@media (min-width: 768px) {
    .extra-info-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>