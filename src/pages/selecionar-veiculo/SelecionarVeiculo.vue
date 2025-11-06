<script setup lang="ts">
import { httpService } from '@/services/http';
import type { FormSelecaoVeiculoFipeType, ResponseVeiculoType, VeiculosFipeType } from '@/services/http/cadastro-veiculo/types';
import { useLoading } from '@/stores/loading';
import { useVeiculo } from '@/stores/veiculo';
import { toast } from '@/utils/swal/toast';
import type { CadastroVeiculoType } from '@/stores/types';
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loadingStore = useLoading()
const veiculoStore = useVeiculo()

const veiculosDisponiveis = ref<VeiculosFipeType[]>([]);

const form = ref<Partial<CadastroVeiculoType>>({});

const veiculoSelecionado = ref<VeiculosFipeType | null>(null);
const isLoading = ref(false);

const isVersionSelected = computed(() => !!veiculoSelecionado.value);

const precoFormatado = computed<number>(() => {
    if (veiculoSelecionado.value?.preco && veiculoSelecionado.value.preco !== '' && typeof veiculoSelecionado.value.preco === 'string') {
        const newValue = veiculoSelecionado.value.preco.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1,$2');
        return parseFloat(newValue);
    }
    return 0;
});

async function nextPage(data: ResponseVeiculoType) {
    const token = router.currentRoute.value.params as { token?: string }
    form.value.etapa_atual = 'informacao-veiculo'
    form.value.id_veiculo_fipe = veiculoSelecionado.value?.id
    form.value.codigo_fipe = data.fipe_code
    form.value.ano_fabricacao = data.year_manufacture.toString()
    form.value.ano_modelo = data.year_model.toString()
    form.value.marca = data.vehicle_brand
    form.value.modelo = data.vehicle_model
    form.value.valor_fipe = veiculoSelecionado.value?.preco
    form.value.placa = data.plate
    form.value.chassi = data.chassis

    await veiculoStore.set(form.value as CadastroVeiculoType)

    router.push({ path: `/informacao-veiculo/${token.token}` });
    return
}

async function onSubmit() {
    if (!isVersionSelected.value || !veiculoSelecionado.value) {
        toast('Por favor, selecione uma versão.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        loadingStore.show("Salvando Escolha....")

        const formVeiculo: FormSelecaoVeiculoFipeType = {
            id: form.value.id ?? 0,
            fipe_code: veiculoSelecionado.value.fipe_codigo,
            fipe_value: precoFormatado.value,
            year_manufacture: Number(veiculoSelecionado.value.ano),
            year_model: Number(veiculoSelecionado.value.ano_modelo),
        }

        const response = await httpService.veiculo.selecionarFipe(formVeiculo);

        if (response.isRight() && response.value) {
            await nextPage(response.value)
        }

    } catch (error) {
        console.error("Erro ao selecionar a versão:", error);
        toast('Ocorreu um erro. Tente novamente.', 'error');
    } finally {
        loadingStore.hidden()
        isLoading.value = false;
    }
}

onMounted(() => {
    const savedData = veiculoStore.get()
    form.value = { ...savedData }

    if (savedData.lista_veiculos_fipe && savedData.lista_veiculos_fipe.length > 1) {
        veiculosDisponiveis.value = savedData.lista_veiculos_fipe;

    }
    if (form.value.id_veiculo_fipe && form.value.id_veiculo_fipe !== "") {
        veiculoSelecionado.value = veiculosDisponiveis.value.find(veiculo => form.value.id_veiculo_fipe === veiculo.id) || null
    }

})

</script>

<template>
    <registration-information :form="form" />
    <v-form-card v-model:formVerification="isVersionSelected" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Selecione a versão do veículo" submit-text="PRÓXIMO" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 1 de 4</v-card-subtitle>
        <v-radio-group v-model="veiculoSelecionado">
            <v-row class="w-100">
                <v-col v-for="veiculo in veiculosDisponiveis" :key="veiculo.id" cols="12">
                    <v-radio :value="veiculo" color="primary" class="justify-center align-center items-center ">
                        <template #label>
                            <v-card class="rounded-xl w-full min-width"
                                :variant="veiculoSelecionado?.id === veiculo.id ? 'tonal' : 'elevated'"
                                :color="veiculoSelecionado?.id === veiculo.id ? 'primary' : 'bg-component'"
                                elevation="2">
                                <v-card-text>
                                    <div class="mb-2 ">
                                        <p class="text-subtitle-1 font-weight-bold text-wrap">
                                            {{ veiculo.modelo }}
                                        </p>
                                        <p
                                            class="text-body-2 font-weight-bold text-medium-emphasis d-flex justify-space-between align-center">
                                            {{ veiculo.marca }}
                                            <v-chip size="small" color="secondary" variant="tonal">
                                                {{ veiculo.ano }} / {{ veiculo.ano_modelo }}
                                            </v-chip>
                                        </p>
                                    </div>
                                    <div class="d-flex justify-center align-center">
                                        <div class="text-center">
                                            <p class="font-weight-bold text-primary">{{ veiculo.preco }}</p>
                                            <p class="text-caption text-medium-emphasis">Valor FIPE</p>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </template>
                    </v-radio>
                </v-col>
            </v-row>
        </v-radio-group>
    </v-form-card>
</template>
<style lang="css" scoped>
.min-width {
    width: 400px;
}
</style>