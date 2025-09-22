<script setup lang="ts">
import { defineModel, watch, computed, defineProps } from 'vue'

const model = defineModel<string>('model')

const props = defineProps({
    label: { type: String, default: 'Nº CELULAR' },
    required: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})

const rules = {
    required: (value: string) => !!value || 'O Campo é obrigatório',
    phone_rule: (value: string) => {
        const regex = /^\(\d{2}\) \d?\d{4}-\d{4}$/
        return !value || regex.test(value) || 'Formato inválido. Verifique o número'
    }
}

const validationRules = computed(() => {
    const activeRules = []
    if (props.required) {
        activeRules.push(rules.required)
    }
    activeRules.push(rules.phone_rule)
    return activeRules
})

watch(model, (newValue) => {
    if (!newValue) return

    const digitos = newValue.replace(/\D/g, '');
    let maskedValue = '';
    if (digitos.length > 0) {
        maskedValue = `(${digitos.substring(0, 2)}`;
    }
    if (digitos.length > 2) {
        maskedValue = `(${digitos.substring(0, 2)}) ${digitos.substring(2, 7)}`;
    }
    if (digitos.length > 7) {
        maskedValue = `(${digitos.substring(0, 2)}) ${digitos.substring(2, 6)}-${digitos.substring(6, 10)}`;
    }

    if (digitos.length > 10) {
        maskedValue = `(${digitos.substring(0, 2)}) ${digitos.substring(2, 7)}-${digitos.substring(7, 11)}`;
    }

    if (newValue !== maskedValue) {
        model.value = maskedValue;
    }
});

</script>
<template>
    <div class="mx-100">
        <v-text-field v-model:model-value="model" :rules="validationRules" :label="props.label" variant="outlined"
            :readonly="props.loading" :loading="props.loading" maxlength="17"  prepend-inner-icon="mdi-phone">
            <template #append-inner>
                <slot name="append-inner">
                </slot>
            </template>
        </v-text-field>
    </div>
</template>
<style scoped></style>