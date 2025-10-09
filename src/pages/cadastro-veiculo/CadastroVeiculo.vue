<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from '@/stores/loading'
import { useVeiculo } from '@/stores/veiculo'
import { httpService } from '@/services/http'
import { toast } from '@/utils/swal/toast'

import type { CadastroVeiculoType } from '@/utils/types'
import type { UserStoresType } from '@/services/http/usuario/types'
import { useUsuario } from '@/stores/usuario'

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
}


async function onSubmit() {
    if (!isFormValid.value) {
        toast('Por favor, preencha os campos obrigatórios.', 'warning')
        return
    }

    isLoading.value = true
    loadingStore.show('Cadastrando veículo...')

    try {
        if (!form.value.etapa_atual || form.value.etapa_atual === '') {
            // cadastra nova (post)
            await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
            // alera existente (put)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        const token = router.currentRoute.value.params as { token?: string }
        form.value.etapa_atual = 'informacao-veiculo'
        form.value.id_loja_usuario = selectedStore.value?.id

        await veiculoStore.set(form.value as CadastroVeiculoType)

        // caso tenha mais de um veiculo
        // form.value.etapa_atual = 'selecionar-veiculo'
        // router.push({ path: `/selecionar-veiculo/${token}` })

        router.push({ path: `/informacao-veiculo/${token.token}` });

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

        const response = await httpService.usuario.currentUser()

        if (response.isRight()) {
            useUsuario().set(response.value?.data || {})
            const userData = response.value?.data
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
