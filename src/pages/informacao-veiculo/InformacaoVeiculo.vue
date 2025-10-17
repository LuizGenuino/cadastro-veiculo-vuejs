<script setup lang="ts">
import { httpService } from '@/services/http';
import type { CamposExtrasType, MetadataType } from '@/services/http/campos-extras/types';
import { useLoading } from '@/stores/loading';
import { useVeiculo } from '@/stores/veiculo';
import { toast } from '@/utils/swal/toast';
import { type CadastroVeiculoType, type FormStateType } from '@/utils/types';
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const ESTADOS_CONSERVACAO = [
    'Excelente', 'Muito Bom', 'Bom', 'Regular', 'Precisa de Reparos'
];

const MOTIVOS_VENDA = [
    'Troca por outro veículo', 'Necessidade financeira', 'Mudança de cidade',
    'Não uso mais', 'Upgrade de modelo', 'Outros'
];

const router = useRouter()
const loadingStore = useLoading()
const veiculoStore = useVeiculo()

const form = ref<Partial<CadastroVeiculoType>>({});

const controleDadosExtras = ref<MetadataType>({
    total: 0,
    groups: []
})

const camposDadosExtras = ref<CamposExtrasType[]>()

const formState = reactive<FormStateType>({
    valorDesejado: '',
    kmRodado: '',
    estadoConservacao: '',
    motivoVenda: '',
});

const isLoading = ref(false);

const isBasicFormValid = ref(false);


const validators = {
    required: (v: any) => !!v || 'Campo obrigatório',
    numeric: (v: string) => !isNaN(parseFloat(v)) && isFinite(Number(v)) || 'Deve ser um número',
};



const isFormCompletelyValid = computed(() => {
    return isBasicFormValid.value
});


async function onSubmit() {
    if (!isFormCompletelyValid.value) {
        toast('Por favor, preencha todos os campos.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        isLoading.value = true
        loadingStore.show("Salvando Informações Extras...")

        form.value.valorDesejado = Number(formState.valorDesejado.replace('.', '')) || 0;
        form.value.kmRodado = Number(formState.kmRodado.replace('.', '')) || 0;
        form.value.estadoConservacao = formState.estadoConservacao;
        form.value.motivoVenda = formState.motivoVenda;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const token = router.currentRoute.value.params as { token?: string }

        form.value.etapa_atual = 'imagens-veiculo';

        await veiculoStore.set(form.value as CadastroVeiculoType);

        loadingStore.hidden()

        router.push({ path: `/imagens-veiculo/${token.token}` });

    } catch (error) {
        console.error("Erro ao salvar informações:", error);
        toast('Ocorreu um erro ao salvar os dados.', 'error');
    } finally {
        loadingStore.hidden()
        isLoading.value = false;
    }
}

async function fetchVehicleExtraFields() {
    isLoading.value = true;
    loadingStore.show('Carregando campos extras...')
    try {
        const response = await httpService.camposExtras.list()
        if (response.isRight()) {
            controleDadosExtras.value = response.value?.control.metadata as MetadataType
            camposDadosExtras.value = response.value?.data as CamposExtrasType[]
        }
    } catch (error) {
        console.error("Erro ao buscar dados do veículo:", error);
        toast('Ocorreu um erro ao carregar os dados do veículo.', 'error');
    } finally {
        loadingStore.hidden()
        isLoading.value = false
    }
}

onMounted(() => {
    fetchVehicleExtraFields();
    const data: Partial<CadastroVeiculoType> = veiculoStore.get();
    form.value = { ...data };
    Object.assign(formState, data);

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
                    required prefix="R$" currency :hint="`Valor Fipe ${form.valor_fipe || 'Não Informado'}`" />
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
            Dados Extras
        </h3>
        <v-skeleton-loader
            v-if="(!controleDadosExtras || controleDadosExtras.total === 0) || (!camposDadosExtras || camposDadosExtras.length === 0) || !loadingStore.state"
            type="card"></v-skeleton-loader>
        <vehicle-extra-fields-form v-else :controle-dados-extras="controleDadosExtras"
            :campos-dados-extras="camposDadosExtras" v-model:extra-fields-model="form" :is-loading="isLoading" />

    </v-form-card>
</template>

<style scoped></style>