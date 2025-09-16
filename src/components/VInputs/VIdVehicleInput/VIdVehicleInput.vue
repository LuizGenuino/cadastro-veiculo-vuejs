<script setup lang="ts">
import { defineModel, ref, computed, defineProps } from 'vue'
import VPlacaField from '../components/VPlacaField.vue'
import VChassiField from '../components/VChassiField.vue'


const model = defineModel<string>('model')

const internalType = ref<'placa' | 'chassi'>('placa')

const props = defineProps({
    initialType: { type: String, default: '' }, // 'placa' ou 'chassi'
    label: { type: String, default: 'PLACA OU CHASSI' },
    required: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})

function toggleType() {
    internalType.value = internalType.value === 'placa' ? 'chassi' : 'placa'
}

</script>

<template>
    <div class="mx-100">
        <VPlacaField v-if="internalType === 'placa'" v-model:model="model" :loading="props.loading" :required="props.required" :label="props.label">
            <template #append-inner v-if="!props.initialType">
                <v-btn color="primary" :text="internalType" variant="flat" @click="toggleType" size="x-small" />
            </template>
        </VPlacaField>
        <VChassiField v-else-if="internalType === 'chassi'"  v-model:model="model" :loading="props.loading" :required="props.required" :label="props.label">
            <template  #append-inner v-if="!props.initialType">
                <v-btn color="primary" :text="internalType" variant="flat" @click="toggleType" size="x-small" />
            </template>
        </VChassiField>
    </div>
</template>

<style scoped></style>