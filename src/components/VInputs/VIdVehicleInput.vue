<script setup lang="ts">
import { defineModel, watch, computed, defineProps, ref } from 'vue'

const model = defineModel<string | null>('model')

const internalType = ref<'placa' | 'chassi'>('placa')

const props = defineProps({
    label: { type: String, default: 'PLACA OU CHASSI' },
    required: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})


const rules = {
    required: (value: string) => !!value || 'O Campo é obrigatório',
    chassi_rule: (value: string) => {
        const regex = /^[0-9A-Z]{17}$/
        return !value || regex.test(value) || 'Formato inválido. Deve conter 17 caracteres'
    },
    place_rule: (value: string) => {
        const regex = /^[A-Z]{3}-[0-9A-Z]{4}$/
        return !value || regex.test(value) || 'Formato inválido. Use AAA-1B34'
    }
}

const validationRules = computed(() => {
    const activeRules = []
    if (props.required) {
        activeRules.push(rules.required)
    }
    if (internalType.value === 'placa') {
        activeRules.push(rules.place_rule)
    } else {
        activeRules.push(rules.chassi_rule)
    }
    return activeRules
})

watch(model, (newVal) => {
    if (!newVal) return

    let cleaned = newVal.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

    if (cleaned.length < 8) {
        internalType.value = 'placa'
        if (cleaned.length > 7) {
            cleaned = cleaned.substring(0, 7)
        }

        let formattedValue = cleaned
        if (cleaned.length > 3) {
            formattedValue = cleaned.substring(0, 3) + '-' + cleaned.substring(3)
        }
        if (newVal !== formattedValue) {
            model.value = formattedValue
        }
        return
    }
    internalType.value = 'chassi'
    if (cleaned.length > 17) {
        cleaned = cleaned.substring(0, 17)
    }
    if (newVal !== cleaned) {
        model.value = cleaned
    }

})

</script>

<template>
    <div class="mx-100">
        <v-text-field v-model:model-value="model" :rules="validationRules" :label="props.label" variant="outlined"
            :readonly="props.loading" :loading="props.loading" maxlength="17" prepend-inner-icon="mdi-motorbike">
            <template #append-inner>
                <p class="bg-primary px-4 py-1 rounded-lg text-caption cursor-pointer" size="x-small">{{internalType}}</p>
            </template>
        </v-text-field>
    </div>
</template>

<style scoped></style>s