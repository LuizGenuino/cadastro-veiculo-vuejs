<script setup lang="ts">
import { defineModel, watch, computed, defineProps } from 'vue'

const model = defineModel<string | number>('model')

const props = defineProps({
    label: { type: String, default: 'VALOR' },
    required: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    currency: { type: Boolean, default: false },
    hint: { type: String, default: '' },
})

const rules = {
    required: (value: string) => !!value || 'O Campo é obrigatório',
}

const validationRules = computed(() => {
    const activeRules = []
    if (props.required) {
        activeRules.push(rules.required)
    }
    return activeRules
})

watch(model, (newValue) => {
    if (!newValue) return

    const strValue = String(newValue);
    const hasDecimal = /[.,]\d{0,2}$/.test(strValue);

    const digitos = hasDecimal ? strValue.slice(0, -3).replace(/\D/g, '') : strValue.replace(/\D/g, '');

    let maskedValue = digitos;

    if (digitos.length > 3) {
        maskedValue = `${digitos.substring(0, digitos.length - 3)}.${digitos.substring(digitos.length - 3)}`;
    }
    if (digitos.length > 6) {
        maskedValue = `${digitos.substring(0, 1)}.${digitos.substring(1, 4)}.${digitos.substring(4, 7)}`;
    }

    if (newValue !== maskedValue) {
        model.value = maskedValue;
    }
});

</script>
<template>
    <div class="mx-100">
        <v-text-field v-model:model-value="model" :rules="validationRules" :label="props.label" variant="outlined"
            :readonly="props.loading" :loading="props.loading" maxlength="9" :prefix="props.prefix"
            :suffix="props.suffix" :prepend-inner-icon="currency ? 'mdi-cash' : 'mdi-speedometer'" :hint="props.hint"
            persistent-hint>
            <template #append-inner>
                <slot name="append-inner">
                </slot>
            </template>
        </v-text-field>
    </div>
</template>
<style scoped></style>