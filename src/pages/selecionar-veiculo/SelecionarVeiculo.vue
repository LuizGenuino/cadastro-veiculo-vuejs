<script setup lang="ts">
import type { CadastroVeiculoType } from '../../utils/types'
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router';

const router = useRoute();

const listaVeiculos = ref<CadastroVeiculoType[]>([]);

const form = reactive<CadastroVeiculoType>({
    uid: '',
    placa_ou_chassi: '',
    nome_proprietario: '',
    telefone_proprietario: ''
})

const formVerification = ref<boolean>(false)

const loading = ref<boolean>(false)

function onSubmit() {
    console.log(formVerification.value);
    console.log(form.placa_ou_chassi);

    if (!form.placa_ou_chassi || !form.telefone_proprietario || !form.telefone_proprietario) return // A validação continua aqui, perfeito!
    console.log('Formulário enviado!', { ...form })
    loading.value = true
    setTimeout(() => (loading.value = false), 2000)
}
function required(v: string) {
    return !!v || 'Campo obrigatório'
}

onMounted(() => {
    const token = router.params;
    const veiculo = router.query.veiculo;
    listaVeiculos.value = veiculo ? JSON.parse(veiculo as string) : [];
    console.log('Token:', token);
    console.log('Veículo:', veiculo);
});
</script>

<template>
    <v-form-card v-model:formVerification="formVerification" :loading="loading" card-title="ESCOLHA VERSÃO"
        submit-text="Selecionar Veículo" @submit="onSubmit">
        <v-col cols="12">

        </v-col>
    </v-form-card>
</template>;