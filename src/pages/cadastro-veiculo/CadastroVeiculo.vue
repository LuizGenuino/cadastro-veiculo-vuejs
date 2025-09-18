<script setup lang="ts">
import type { CadastroVeiculoType } from '../../utils/types'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive<CadastroVeiculoType>({
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
    const veiculo = JSON.stringify([{...form, uid: '1'}, {...form, uid: '2'}, {...form, uid: '3'}]);
    const token = '123';
    router.push({ path: `/selecionar-veiculo/${token}`, query: { veiculo } });

}
function required(v: string) {
    return !!v || 'Campo obrigatório'
}
</script>

<template>
    <v-form-card v-model:formVerification="formVerification" :loading="loading" card-title="CADASTRO DE VEÍCULO"
        submit-text="Cadastrar Veículo" @submit="onSubmit">
        <v-col cols="12">
            <v-id-vehicle-input required v-model:model="form.placa_ou_chassi" :loading="loading"
                label="PLACA OU CHASSI*"></v-id-vehicle-input>
        </v-col>
        <v-col cols="12">
            <v-text-field v-model="form.nome_proprietario" :readonly="loading" :loading="loading" :rules="[required]"
                class="rounded-xl" label="NOME DO PROPRIETÁRIO*" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-phone-field required v-model:model="form.telefone_proprietario" :loading="loading"
                label="TELEFONE DO PROPRIETÁRIO*"></v-phone-field>
        </v-col>
    </v-form-card>
</template>;