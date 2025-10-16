<script setup lang="ts">
import { defineProps, defineModel, withDefaults } from 'vue'


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



</script>

<template>
    <v-card class="py-4 bg-background" :width="props.cardWidth"
        :max-width="props.cardMaxWidth" :elevation="0">
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

            <v-card-actions class="justify-center">
                <slot name="actions">
                    <v-btn class="rounded-lg text-button px-4" elevation="4" size="large" color="primary" variant="flat"
                        :disabled="!formVerification" :loading="loading" type="submit">
                        {{ props.submitText }} </v-btn>
                </slot>
            </v-card-actions>
        </v-form>
    </v-card>
</template>