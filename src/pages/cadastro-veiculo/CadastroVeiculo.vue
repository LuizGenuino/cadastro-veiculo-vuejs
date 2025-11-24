<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from '@/stores/loading'
import { useVeiculo } from '@/stores/veiculo'
import { httpService } from '@/services/http'
import { toast } from '@/utils/swal/toast'

import type { CadastroVeiculoType } from '@/stores/types'
import type { UserStoresType } from '@/services/http/usuario/types'
import { useUsuario } from '@/stores/usuario'
import type { FormRegistroVeiculoType, ResponseVeiculoType } from '@/services/http/cadastro-veiculo/types'

const router = useRouter()
const loadingStore = useLoading()
const veiculoStore = useVeiculo()

const form = ref<Partial<CadastroVeiculoType>>({})
const lojasUsuario = ref<UserStoresType[]>([])
const selectedStore = ref<UserStoresType | null>(null)
const isFormValid = ref(false)
const isLoading = ref(false)

const validators = {
    required: (v: string) => !!v || 'Campo obrigatório',
    minLength: (v: string) => v.length > 3 || "Deve conter no minimo 3 caracteres"
}


function clearForm() {
    form.value.id = undefined
    form.value.id_loja_usuario = undefined
    form.value.nome_loja_usuario = undefined
    form.value.short_id = undefined
    form.value.placa = undefined
    form.value.chassi = undefined
    form.value.id_veiculo_fipe = undefined
    form.value.codigo_fipe = undefined
    form.value.ano_fabricacao = undefined
    form.value.ano_modelo = undefined
    form.value.marca = undefined
    form.value.modelo = undefined
    form.value.valor_fipe = undefined
    form.value.lista_veiculos_fipe = undefined
}

async function nextPage(data: ResponseVeiculoType) {
    clearForm()

    form.value.id = data.id
    form.value.id_loja_usuario = data.store_id
    form.value.nome_loja_usuario = data.store_name
    form.value.short_id = data.short_id
    const token = router.currentRoute.value.params as { token?: string }
    form.value.etapa_atual = 'informacao-veiculo'

    if (data.fipes === null) {
        await veiculoStore.set(form.value as CadastroVeiculoType)
        router.push({ path: `/informacao-veiculo/${token.token}` });
        return
    }

    if (data.fipes?.length === 1) {
        form.value.id_veiculo_fipe = data.fipes[0].id
        form.value.codigo_fipe = data.fipes[0].fipe_codigo
        form.value.ano_fabricacao = data.fipes[0].ano
        form.value.ano_modelo = data.fipes[0].ano_modelo
        form.value.marca = data.fipes[0].marca
        form.value.modelo = data.fipes[0].modelo
        form.value.valor_fipe = data.fipes[0].preco
        form.value.placa = data.plate
        form.value.chassi = data.chassis
        await veiculoStore.set(form.value as CadastroVeiculoType)
        router.push({ path: `/informacao-veiculo/${token.token}` });
        return
    }

    if (data.fipes?.length > 1) {
        form.value.lista_veiculos_fipe = data.fipes
        form.value.etapa_atual = 'selecionar-veiculo'
        await veiculoStore.set(form.value as CadastroVeiculoType)
        router.push({ path: `/selecionar-veiculo/${token.token}` })
        return

    }
}

async function onSubmit() {
    if (!isFormValid.value) {
        toast('Por favor, preencha os campos obrigatórios.', 'warning')
        return
    }

    try {
        const formVeiculo: FormRegistroVeiculoType = {
            customer_name: form.value.nome_proprietario ?? '',
            customer_phone: form.value.telefone_proprietario ?? '',
            store_id: selectedStore.value?.id ?? 0,
            vehicle: form.value.placa_ou_chassi ?? '',
            type_vehicle: (form.value.placa_ou_chassi ?? '').length < 9 ? "PLATE" : "CHASSIS",
        }

        isLoading.value = true
        loadingStore.show('Cadastrando veículo...')

        const response = await httpService.veiculo.cadastrar(formVeiculo)

        if (response.isRight() && response.value) {
            await nextPage(response.value)
        }

    } catch (error) {
        console.error('Falha ao cadastrar veículo:', error)
        toast('Não foi possível cadastrar o veículo. Tente novamente.', 'error')
    } finally {
        loadingStore.hidden()
        isLoading.value = false
    }
}

async function fetchUserStores() {
    isLoading.value = true
    loadingStore.show('Carregando suas lojas...')

    try {
        const usuario = useUsuario().get()

        if (usuario.user_stores && usuario.user_stores.length > 0) {
            lojasUsuario.value = usuario.user_stores
            return
        }

        const response = await httpService.usuario.usuarioAtual()

        if (response.isRight()) {

            useUsuario().set(response.value || {})
            const userData = response.value
            lojasUsuario.value = userData?.user_stores ?? []

            if (!lojasUsuario.value.length) {
                toast('Usuário não possui lojas vinculadas. Contate o suporte!.', 'error')
                return
            }
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
        toast('Não foi possível carregar os dados do usuário.', 'error')
    } finally {
        loadingStore.hidden()
        isLoading.value = false
        if (lojasUsuario.value.length === 1) {
            selectedStore.value = lojasUsuario.value[0]
            form.value.id_loja_usuario = lojasUsuario.value[0].id
        }
    }
}

onMounted(async () => {
    await fetchUserStores()
    const savedData = veiculoStore.get()
    form.value = { ...savedData }

    if (savedData.id_loja_usuario && lojasUsuario.value.length) {
        selectedStore.value =
            lojasUsuario.value.find(loja => loja.id == savedData.id_loja_usuario) || null
    }
})
</script>

<template>
    <v-form-card v-model:formVerification="isFormValid" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Informações básicas do veículo" submit-text="Cadastrar Veículo" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">
            passo 1 de 4
        </v-card-subtitle>

        <v-row>
            <v-col cols="12">
                <v-autocomplete v-model="selectedStore" label="ESCOLHA A LOJA*" :items="lojasUsuario" item-title="name"
                    return-object variant="outlined" :readonly="isLoading" :rules="[validators.required]"
                    :disabled="lojasUsuario.length <= 1" />
            </v-col>

            <v-col cols="12">
                <v-id-vehicle-input v-model:model="form.placa_ou_chassi" :loading="isLoading" label="PLACA OU CHASSI*"
                    required />
            </v-col>

            <v-col cols="12">
                <v-text-field v-model="form.nome_proprietario" :readonly="isLoading" :loading="isLoading"
                    :rules="[validators.required, validators.minLength]" label="NOME DO PROPRIETÁRIO*"
                    variant="outlined" prepend-inner-icon="mdi-account" :maxlength="50" />
            </v-col>

            <v-col cols="12">
                <v-phone-field v-model:model="form.telefone_proprietario" :loading="isLoading"
                    label="TELEFONE DO PROPRIETÁRIO*" required />
            </v-col>
        </v-row>
    </v-form-card>
</template>
