<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from '@/stores/loading'
import { useVeiculo } from '@/stores/veiculo'
import { httpService } from '@/services/http'
import { toast } from '@/utils/swal/toast'

import { ROLE_PERMISSOES, type CadastroRepasseType, type CadastroVeiculoType } from '@/stores/types'
import type { UserStoresType } from '@/services/http/usuario/types'
import { useUsuario } from '@/stores/usuario'
import type { FormRegistroVeiculoType, ResponseVeiculoType } from '@/services/http/cadastro-veiculo/types'
import { formatNumberToString } from '@/utils/numberFormatter'

const router = useRouter()
const veiculoStore = useVeiculo()
const loadingStore = useLoading()

const selectHoursOptions = [
    { title: '24 horas', value: 24 },
    { title: '48 horas', value: 48 },
    { title: '72 horas', value: 72 },
]

const repasseTipoOptions = [{ title: 'COTAÇÃO', value: 'COTACAO' }, { title: 'REPASSE', value: 'REPASSE' }]

const form = ref<Partial<CadastroVeiculoType>>({})

const formRepasse = ref<CadastroRepasseType>({} as CadastroRepasseType)
const isFormValid = ref(false)
const isLoading = ref(false)

const validators = {
    required: (v: string) => !!v || 'Campo obrigatório',
    minLength: (v: string) => v.length > 3 || "Deve conter no minimo 3 caracteres"
}

async function onSubmit() {
    console.log('formRepasse', formRepasse.value)
}


function syncronizeData(savedData: Partial<CadastroVeiculoType>) {
    form.value = { ...savedData }

    if (typeof savedData.repasse === 'string') {
        const value = savedData.repasse as string
        form.value.repasse = value.toLowerCase() === 'true'
    }

    formRepasse.value.vehicleId = savedData.id as number
    formRepasse.value.repasse_tipo = 'COTACAO'
    formRepasse.value.inicia_em = new Date().toISOString().split('T')[0]
    formRepasse.value.observacao = savedData.observacao || ''
}

onMounted(async () => {
    const savedData = veiculoStore.get()
    syncronizeData(savedData)
})
</script>

<template>
    <registration-information :form="form" />

    <v-form-card v-model:formVerification="isFormValid" :loading="isLoading" card-title="CADASTRO DE REPASSE"
        card-subtitle="Informações para Cadastar Anuncio" submit-text="Cadastrar Repasse" @submit.prevent="onSubmit">
        <br>

        <v-row>
            <v-col cols="12">
                <v-select label="CADASTRAR COMO*" v-model="formRepasse.repasse_tipo" :items="repasseTipoOptions"
                    variant="outlined" :readonly="isLoading" :rules="[validators.required]" @update:modelValue="() => {
                        formRepasse.preco_compra = undefined
                        formRepasse.termina_em = undefined
                    }"></v-select>
            </v-col>

            <v-col cols="12">
                <v-currency-field v-model:model="formRepasse.lance_minimo" :readonly="isLoading" label="LANCE MÍNIMO*"
                    required prefix="R$" currency
                    :hint="`${form.valorDesejado ? 'Valor Desejado: R$ ' + formatNumberToString(form.valorDesejado) : ''}`" />
            </v-col>

            <v-col cols="12" v-if="formRepasse.repasse_tipo === 'COTACAO'">
                <v-text-field v-model="formRepasse.termina_em" :readonly="isLoading" :loading="isLoading"
                    :rules="[validators.required]" label="DATA FIM*" variant="outlined" type="date" required />
            </v-col>
            <v-col cols="12" v-else>
                <v-select v-model="formRepasse.termina_em" :items="selectHoursOptions" variant="outlined"
                    label="TEMINA EM*" required :readonly="isLoading" :rules="[validators.required]" />
            </v-col>

            <v-col cols="12" v-if="formRepasse.repasse_tipo === 'REPASSE'">
                <v-currency-field v-model:model="formRepasse.preco_compra" :readonly="isLoading"
                    label="PREÇO DE COMPRA*" required prefix="R$" currency
                    :hint="`${form.valor_fipe ? 'Valor Fipe: R$ ' + formatNumberToString(form.valor_fipe) : ''}`" />
            </v-col>
            <v-col cols="12">
                <v-textarea label="OBSERVAÇÕES" disabled :readonly="isLoading" v-model="formRepasse.observacao"
                    variant="outlined" rows="3"></v-textarea>
            </v-col>
        </v-row>
    </v-form-card>
</template>
