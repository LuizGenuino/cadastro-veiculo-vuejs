<script setup lang="ts">
import { useLoading } from '@/stores/loading';
import { useVeiculo } from '@/stores/veiculo';
import { swal } from '@/utils/swal';

const loadingStore = useLoading()
const veiculoStore = useVeiculo()

const props = withDefaults(defineProps<{
    loading?: boolean
    cardTitle: string
    cardSubtitle?: string
    submitText?: string
    cardWidth?: string | number
    cardMaxWidth?: string | number
}>(), {
    loading: false,
    submitText: 'Salvar',
    cardWidth: '95%',
    cardMaxWidth: 500,
})
const formVerification = defineModel<boolean>('formVerification', { default: true });

const emit = defineEmits<{
    (e: 'onSubmit'): void
}>()

async function resetForm() {
    try {
        const result = await swal.confirm("Essa ação descartar todos os dados preenchidos! Voce tem certeza?", 'Reiniciar Cadastro?')
        if (!result) {
            return
        }
        loadingStore.show("Limpando dados do Formulario....")
        await veiculoStore.clear()
    } catch (error) {
        console.error(error);
    } finally {
        loadingStore.hidden()
    }



}

</script>

<template>
    <v-card class="py-4 bg-background" :width="props.cardWidth" :max-width="props.cardMaxWidth" :elevation="0">
        <v-form v-model="formVerification" @submit.prevent="emit('onSubmit')">
            <v-card-title class="page-header font-weight-bold text-center">
                {{ props.cardTitle }}
            </v-card-title>
            <v-card-subtitle class="page-subtitle text-center" v-if="props.cardSubtitle">
                {{ props.cardSubtitle }}
            </v-card-subtitle>
            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-card-actions class="flex-column">
                <slot name="actions">
                    <v-btn class="rounded-lg text-button px-4" elevation="4" size="large" color="primary" variant="flat"
                        :disabled="!formVerification" :loading="loading" type="submit">
                        {{ props.submitText }} </v-btn>
                    <v-btn class="rounded-lg text-button px-4 mt-4" elevation="4" size="large" color="error"
                        variant="flat" :loading="loading" @click="resetForm()">
                        reiniciar cadastro </v-btn>
                </slot>
            </v-card-actions>
        </v-form>
    </v-card>
</template>