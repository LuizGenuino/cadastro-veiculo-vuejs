<script setup lang="ts">
import type { CadastroVeiculoType, SnackbarType, VeiculoType } from '@/utils/types';
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'


const showSnackbar = inject<SnackbarType>('snackbar', () => { });
const router = useRouter();
const route = useRoute();

const veiculosDisponiveis = ref<VeiculoType[]>([
    { uid: '1', placa: 'ABC-1234', marca: 'Honda', modelo: 'XRE 300/ 300 ABS/ FLEX', ano: '2019', valor_fipe: 'R$ 22.150,00' },
    { uid: '2', placa: 'ABC-1234', marca: 'Yamaha', modelo: 'FZ15 150 FAZER FLEX', ano: '2023', valor_fipe: 'R$ 17.590,00' },
    { uid: '3', placa: 'ABC-1234', marca: 'Honda', modelo: 'CG 160 TITAN FLEXONE/Ed.Especial 40 Anos', ano: '2018', valor_fipe: 'R$ 13.770,00' }
]);

const form = ref<CadastroVeiculoType>({
    loja_usuario: '',
    placa_ou_chassi: '',
    nome_proprietario: '',
    telefone_proprietario: '',
    marca: '',
    modelo: '',
    ano: '',
    valor_fipe: '',
    placa: '',
    id_veiculo_fipe: '',
});



const veiculoSelecionado = ref<VeiculoType | null>(null);
const isLoading = ref(false);


const isVersionSelected = computed(() => !!veiculoSelecionado.value);

async function onSubmit() {
    if (!isVersionSelected.value || !veiculoSelecionado.value) {
        showSnackbar('Por favor, selecione uma versão.', 'warning');
        return;
    }

    isLoading.value = true;
    try {
        form.value = { ...form.value, ...veiculoSelecionado.value, id_veiculo_fipe: veiculoSelecionado.value.uid };
        console.log('Form atualizado:', form.value);


        await new Promise(resolve => setTimeout(resolve, 1500));

        showSnackbar('Versão selecionada com sucesso!', 'success')

        const token = '123';

        const veiculo = JSON.stringify({ ...form.value });

        router.push({ path: `/informacao-veiculo/${token}`, query: { veiculo }, replace: true });

    } catch (error) {
        console.error("Erro ao selecionar a versão:", error);
        showSnackbar('Ocorreu um erro. Tente novamente.', 'error');
    } finally {
        isLoading.value = false;
    }
}


onMounted(() => {
    form.value = JSON.parse(route.query.veiculo as string);
});
</script>

<template>
    <v-form-card v-model:formVerification="isVersionSelected" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Selecione a versão do veículo" submit-text="PRÓXIMO" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 1 de 4</v-card-subtitle>
        <v-radio-group v-model="veiculoSelecionado">
            <v-row class="w-100">
                <v-col v-for="veiculo in veiculosDisponiveis" :key="veiculo.uid" cols="12">
                    <v-radio :value="veiculo" color="primary" class="justify-center align-center items-center ">
                        <template #label>
                            <v-card class="rounded-xl w-full min-width"
                                :variant="veiculoSelecionado?.uid === veiculo.uid ? 'tonal' : 'elevated'"
                                :color="veiculoSelecionado?.uid === veiculo.uid ? 'primary' : 'blue-grey-lighten-5'"
                                elevation="2">
                                <v-card-text>
                                    <div class="mb-2 ">
                                        <p class="text-subtitle-1 font-weight-bold text-wrap">
                                            {{ veiculo.modelo }}
                                        </p>
                                        <p
                                            class="text-body-2 font-weight-bold text-medium-emphasis d-flex justify-space-between align-center">
                                            {{ veiculo.marca }}
                                            <v-chip size="small" color="primary" variant="tonal" class="me-2">
                                                {{ veiculo.placa }}
                                            </v-chip>
                                            <v-chip size="small" color="secondary" variant="tonal">
                                                {{ veiculo.ano }}
                                            </v-chip>
                                        </p>
                                    </div>
                                    <div class="d-flex justify-center align-center">
                                        <div class="text-end">
                                            <p class="font-weight-bold text-primary">{{ veiculo.valor_fipe }}</p>
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