<script setup lang="ts">
import { httpService } from '@/services/http';
import { useLoading } from '@/stores/loading';
import { useVeiculo } from '@/stores/veiculo';
import { toast } from '@/utils/swal/toast';
import { type CadastroVeiculoType, type FormCamposExtrasType, type FormStateType } from '@/stores/types';
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInformacoesAdicionaisType, ResponseInformacoesAdicionaisType } from '@/services/http/cadastro-veiculo/types';


const ESTADOS_CONSERVACAO = [
    "EXCELENTE", "BOM", "REGULAR", "RUIM"
];

const MOTIVOS_VENDA = [
    'Troca por outro veículo', 'Necessidade financeira', 'Mudança de cidade',
    'Não uso mais', 'Upgrade de modelo', 'Outros'
];

const router = useRouter()
const loadingStore = useLoading()
const veiculoStore = useVeiculo()

const form = ref<Partial<CadastroVeiculoType>>({});

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

function ExtraFieldWithOutNullValue(extraFields: Record<string, any>): Record<string, FormCamposExtrasType> {
    return Object.fromEntries(
        Object.entries(extraFields)
            .filter(([_, value]) => value?.valor !== null && value?.valor !== '')
            .map(([key, value]) => {
                // cria uma cópia independente do objeto
                const v = { ...value };

                if (v.valor === 'sim') v.valor = true;
                else if (v.valor === 'não' || v.valor === 'nao') v.valor = false;

                return [key, v] as const;
            })
    ) as Record<string, FormCamposExtrasType>;
}

async function nextPage(data: ResponseInformacoesAdicionaisType) {
    const token = router.currentRoute.value.params as { token?: string }

    form.value.valorDesejado = data.desired_value;
    form.value.kmRodado = data.mileage;
    form.value.estadoConservacao = data.conservation_state;
    form.value.motivoVenda = data.sale_reason;
    form.value.etapa_atual = 'imagens-veiculo';

    await veiculoStore.set(form.value as CadastroVeiculoType);

    router.push({ path: `/imagens-veiculo/${token.token}` });

    return
}

async function onSubmit() {
    if (!isFormCompletelyValid.value) {
        toast('Por favor, preencha todos os campos.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        isLoading.value = true
        loadingStore.show("Salvando Informações Extras...")

        const formVeiculo: FormInformacoesAdicionaisType = {
            vehicle_id: Number(form.value.id) || 0,
            desired_value: Number(formState.valorDesejado.replace('.', '').replace(',', '.')) || 0,
            mileage: Number(formState.kmRodado.replace('.', '')) || 0,
            conservation_state: formState.estadoConservacao,
            sale_reason: formState.motivoVenda,
            extra_fields: ExtraFieldWithOutNullValue(form.value.campos_extras || {}),
        }

        const response = await httpService.veiculo.cadastrarDadosExtras(formVeiculo);

        if (response.isRight() && response.value) {
            await nextPage(response.value)
        }

    } catch (error) {
        console.error("Erro ao salvar informações:", error);
        toast('Ocorreu um erro ao salvar os dados.', 'error');
    } finally {
        loadingStore.hidden()
        isLoading.value = false;
    }
}

onMounted(() => {
    const data: Partial<CadastroVeiculoType> = veiculoStore.get();
    form.value = { ...data };
    Object.assign(formState, data);

});


</script>

<template>
    <v-banner class="mb-4" :max-width="700" v-if="!form.valor_fipe" bg-color="orange-darken-1" color="orange-darken-3"
        icon="mdi-alert" lines="one">
        <template v-slot:text>
            <p class="text-orange-lighten-4 font-weight-medium">
                Tabela FIPE não encontrada para essa placa
            </p>
        </template>
    </v-banner>

    <registration-information :form="form" />

    <v-form-card v-model:formVerification="isBasicFormValid" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Complete os dados adicionais" submit-text="Proximo" :is-submit-disabled="!isFormCompletelyValid"
        @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 2 de 4</v-card-subtitle>
        <v-row>
            <v-col cols="12">
                <v-currency-field v-model:model="formState.valorDesejado" :readonly="isLoading" label="VALOR DESEJADO*"
                    required prefix="R$" currency :hint="`${form.valor_fipe ? 'Valor Fipe:' + form.valor_fipe : ''}`" />
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

        <vehicle-extra-fields-form v-model:extra-fields-model="form" v :is-loading="isLoading" />

    </v-form-card>
</template>

<style scoped></style>