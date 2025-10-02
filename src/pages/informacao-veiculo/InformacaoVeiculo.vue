<script setup lang="ts">
import { useLoading } from '@/stores/loading';
import { parseQueryParametersToData, transformDataToQueryParameters } from '@/utils/queryParameters';
import { toast } from '@/utils/swal/toast';
import { PERGUNTAS, type CadastroVeiculoType, type FormStateType } from '@/utils/types';
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'


const ESTADOS_CONSERVACAO = [
    'Excelente', 'Muito Bom', 'Bom', 'Regular', 'Precisa de Reparos'
];

const MOTIVOS_VENDA = [
    'Troca por outro veículo', 'Necessidade financeira', 'Mudança de cidade',
    'Não uso mais', 'Upgrade de modelo', 'Outros'
];



const router = useRouter();
const route = useRoute();
const query = route.query;

const form = reactive<Partial<CadastroVeiculoType>>({});


const formState = reactive<FormStateType>({
    valorDesejado: '',
    kmRodado: '',
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
    return PERGUNTAS.every(pergunta => formState.checklist[pergunta.key] !== undefined);
});


const isFormCompletelyValid = computed(() => {
    return isBasicFormValid.value && areAllQuestionsAnswered.value;
});


async function onSubmit() {
    if (!isFormCompletelyValid.value) {
        toast('Por favor, preencha todos os campos.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        useLoading().show("Salvando Informações Extras...")

        console.log(formState.valorDesejado);
        console.log(formState.kmRodado);



        form.valorDesejado = Number(formState.valorDesejado.replace('.', '')) || 0;
        form.kmRodado = Number(formState.kmRodado.replace('.', '')) || 0;
        form.estadoConservacao = formState.estadoConservacao;
        form.motivoVenda = formState.motivoVenda;
        form.checklist = formState.checklist;

        console.log(formState.checklist);


        await new Promise(resolve => setTimeout(resolve, 1500));

        const token = '123';

        useLoading().hidden()

        const queryObj: Record<string, any> = transformDataToQueryParameters(form);

        await router.replace({ query: queryObj });

        router.push({ path: `/imagens-veiculo/${token}`, query: queryObj });


    } catch (error) {
        console.error("Erro ao salvar informações:", error);
        toast('Ocorreu um erro ao salvar os dados.', 'error');
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    const data: Partial<CadastroVeiculoType> = parseQueryParametersToData(query);
    Object.assign(form, data);
    if (data.valorDesejado) formState.valorDesejado = String(data.valorDesejado);
    if (data.kmRodado) formState.kmRodado = String(data.kmRodado);
    if (data.estadoConservacao) formState.estadoConservacao = data.estadoConservacao;
    if (data.motivoVenda) formState.motivoVenda = data.motivoVenda;
    if (data.checklist) formState.checklist = { ...data.checklist };

});
</script>

<template>
    <v-form-card v-model:formVerification="isBasicFormValid" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Complete os dados adicionais" submit-text="Proximo" :is-submit-disabled="!isFormCompletelyValid"
        @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 2 de 4</v-card-subtitle>
        <v-row>
            <v-col cols="12">
                <v-currency-field v-model:model="formState.valorDesejado" :readonly="isLoading" label="VALOR DESEJADO*"
                    required prefix="R$" currency :hint="`Valor Fipe ${form.valor_fipe}`" />
            </v-col>

            <v-col cols="12">
                <v-currency-field v-model:model="formState.kmRodado" :readonly="isLoading" label="KM RODADO*"
                    suffix="KM" required />
            </v-col>

            <v-col cols="12">
                <v-select v-model="formState.estadoConservacao" label="ESTADO DE CONSERVAÇÃO*"
                    :items="ESTADOS_CONSERVACAO" variant="outlined" :readonly="isLoading"
                    :rules="[validators.required]" />
            </v-col>

            <v-col cols="12">
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
                        <v-btn color="primary" :value="true" class="flex-grow-1">
                            <v-icon start>mdi-check</v-icon>
                            Sim
                        </v-btn>
                        <v-btn color="error" :value="false" class="flex-grow-1">
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