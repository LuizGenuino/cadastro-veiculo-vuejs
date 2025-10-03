<script setup lang="ts">
import { defineModel, watch, computed , defineProps} from 'vue'

const model = defineModel<string>('model')

const props = defineProps({
    label: { type: String, default: 'PLACA' },
    required: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})

const rules = {
    required: (value: string) => !!value || 'O Campo é obrigatório',
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
    activeRules.push(rules.place_rule)
    return activeRules
})

watch(model, (newVal) => {
    if (!newVal) return

    let cleaned = newVal.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

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
})

</script>
<template>
    <div class="mx-100">
        <v-text-field v-model:model-value="model" :rules="validationRules" :label="props.label" variant="outlined"
            :readonly="props.loading" :loading="props.loading"  prepend-inner-icon="mdi-card-text">
            <template #append-inner>
                <slot name="append-inner">
                </slot>
            </template>
        </v-text-field>
    </div>
</template>
<style scoped></style>