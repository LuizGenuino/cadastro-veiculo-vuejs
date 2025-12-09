<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoading } from '@/stores/loading'
import { useVeiculo } from '@/stores/veiculo'
import { httpService } from '@/services/http'
import { toast } from '@/utils/swal/toast'

import type { CadastroVeiculoType } from '@/stores/types'
import { formatNumberToString, formatStringToNumber } from '@/utils/numberFormatter'
import type { FormRegistroRepasseType } from '@/services/http/cadastro-repasse/types'
import SuccessDialog from './components/SuccessDialog.vue'

const veiculoStore = useVeiculo()
const loadingStore = useLoading()

const selectHoursOptions = [
    { title: '24 horas', value: 24 },
    { title: '48 horas', value: 48 },
    { title: '72 horas', value: 72 },
]

const repasseTipoOptions = [{ title: 'COTAÇÃO', value: 'Cotacao' }, { title: 'REPASSE', value: 'Repasse' }]

const form = ref<Partial<CadastroVeiculoType>>({})

const formRepasse = ref<FormRegistroRepasseType>({} as FormRegistroRepasseType)
const isFormValid = ref(false)
const isLoading = ref(false)

const isSuccessModalVisible = ref(false)

const validators = {
    required: (v: string) => !!v || 'Campo obrigatório',
    minLength: (v: string) => v.length > 3 || "Deve conter no minimo 3 caracteres"
}

async function nextPage() {
    const veiculoStore = useVeiculo();
    await veiculoStore.set(form.value as CadastroVeiculoType)
    toast('Repasse cadastrado com sucesso!', 'success');
    isSuccessModalVisible.value = true
}

async function onSubmit() {
    if (!isFormValid.value) {
        toast('Por favor, preencha os campos obrigatórios.', 'warning')
        return
    }
    try {
        isLoading.value = true
        loadingStore.show('Cadastrando Repasse...')

        const response = await httpService.repasse.cadastrar(formatFormValue())

        if (response.isRight() && response.value) {
            form.value.publicado = true
            await nextPage()
        }

    } catch (error) {
        console.error('Falha ao cadastrar repasse:', error)
        toast('Não foi possível cadastrar o repasse. Tente novamente.', 'error')
    } finally {
        loadingStore.hidden()
        isLoading.value = false
    }
}

function formatFormValue(): FormRegistroRepasseType {
    formRepasse.value.lance_minimo = formatStringToNumber(formRepasse.value.lance_minimo as unknown as string)
    let dataFim = formRepasse.value.termina_em
    if (formRepasse.value.repasse_tipo === 'Repasse') {
        const date = new Date()
        const hoursToAdd = Number(formRepasse.value.termina_em) ?? 24
        date.setHours(date.getHours() + hoursToAdd)

        dataFim = date.toISOString().split('T')[0]
        formRepasse.value.preco_compra = formatStringToNumber(formRepasse.value.preco_compra as unknown as string)
    }

    if (formRepasse.value.repasse_tipo === 'Cotacao') {
        formRepasse.value.preco_compra = undefined
    }

    return {
        ...formRepasse.value,
        termina_em: dataFim as string,
    }
}


function syncronizeData(savedData: Partial<CadastroVeiculoType>) {
    form.value = { ...savedData }

    if (typeof savedData.repasse === 'string') {
        const value = savedData.repasse as string
        form.value.repasse = value.toLowerCase() === 'true'
    }

    formRepasse.value.vehicleId = savedData.id as number
    formRepasse.value.repasse_tipo = 'Cotacao'
    formRepasse.value.inicia_em = new Date().toISOString().split('T')[0]
    formRepasse.value.observacao = savedData.observacao || ''
}

onMounted(async () => {
    const savedData = veiculoStore.get()
    syncronizeData(savedData)
    if (savedData.publicado === true || String(savedData.publicado).toLowerCase() === 'true') {
        isSuccessModalVisible.value = true
    }
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
                    variant="outlined" :readonly="isLoading" :loading="isLoading" :rules="[validators.required]"
                    @update:modelValue="() => {
                        formRepasse.preco_compra = undefined
                        formRepasse.termina_em = undefined
                    }"></v-select>
            </v-col>

            <v-col cols="12">
                <v-currency-field v-model:model="formRepasse.lance_minimo" :readonly="isLoading" label="LANCE MÍNIMO*"
                    required prefix="R$" currency
                    :hint="`${form.valorDesejado ? 'Valor Desejado: R$ ' + formatNumberToString(form.valorDesejado) : ''}`" />
            </v-col>

            <v-col cols="12" v-if="formRepasse.repasse_tipo === 'Cotacao'">
                <v-text-field v-model="formRepasse.termina_em" :readonly="isLoading" :loading="isLoading"
                    :rules="[validators.required]" label="DATA FIM*" variant="outlined" type="date" required />
            </v-col>
            <v-col cols="12" v-else>
                <v-select v-model="formRepasse.termina_em" :items="selectHoursOptions" variant="outlined"
                    label="TEMINA EM*" required :readonly="isLoading" :loading="isLoading"
                    :rules="[validators.required]" />
            </v-col>

            <v-col cols="12" v-if="formRepasse.repasse_tipo === 'Repasse'">
                <v-currency-field v-model:model="formRepasse.preco_compra" :readonly="isLoading"
                    label="PREÇO DE COMPRA*" required prefix="R$" currency
                    :hint="`${form.valor_fipe ? 'Valor Fipe: R$ ' + formatNumberToString(form.valor_fipe) : ''}`" />
            </v-col>
            <v-col cols="12">
                <v-textarea label="OBSERVAÇÕES" disabled :readonly="isLoading" :loading="isLoading"
                    v-model="formRepasse.observacao" variant="outlined" rows="3"></v-textarea>
            </v-col>
        </v-row>
    </v-form-card>
    <success-dialog :is-modal-visible="isSuccessModalVisible" :form="form"></success-dialog>
</template>
