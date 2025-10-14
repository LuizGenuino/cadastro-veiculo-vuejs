<script setup lang="ts">
import type { CamposExtrasType, } from '@/services/http/campos-extras/types';
import { defineProps, onMounted, computed } from 'vue';

const model = defineModel<any>('model')

const props = defineProps<{
    field: CamposExtrasType
}>()

//EXEMPLO DE REGEX VALIDO '^[A-Z]{3}-[0-9A-Z]{4}'


const validators = {
    required: (v: any) => props.field.is_required ? !!v || 'Campo obrigatório' : true,
    pattern: (value: string) => {
        const regex = props.field.validation.pattern ? new RegExp(props.field.validation.pattern) : null

        if (!regex) return true
        return !value || regex.test(value) || 'Formato do campo inválido.'
    },
    minLength: (v: string) => {
        if (props.field.validation.min_length) {
            return v.length >= props.field.validation.min_length || `Mínimo de ${props.field.validation.min_length} caracteres.`
        }
        return true
    },
    maxLength: (v: string) => {
        if (props.field.validation.max_length) {
            return v.length >= props.field.validation.max_length || `Mínimo de ${props.field.validation.max_length} caracteres.`
        }
        return true
    },
    minValue: (v: number) => {
        if (props.field.validation.min_value !== undefined && props.field.validation.min_value !== null) {
            return v >= props.field.validation.min_value || `Valor mínimo de ${props.field.validation.min_value}.`
        }
        return true
    },
    maxValue: (v: number) => {
        if (props.field.validation.max_value !== undefined && props.field.validation.max_value !== null) {
            return v <= props.field.validation.max_value || `Valor máximo de ${props.field.validation.max_value}.`
        }
        return true
    },
};

const validationRules = computed(() => {
    const activeRules = []
    if (props.field.is_required) {
        activeRules.push(validators.required)
    }
    if (props.field.validation.pattern) {
        activeRules.push(validators.pattern)
    }
    if (props.field.validation.min_length) {
        activeRules.push(validators.minLength)
    }
    if (props.field.validation.max_length) {
        activeRules.push(validators.maxLength)
    }
    if (props.field.validation.min_value) {
        activeRules.push(validators.minValue)
    }
    if (props.field.validation.max_value) {
        activeRules.push(validators.maxValue)
    }
    return activeRules
})



onMounted(() => {

})

</script>

<template>
    <v-text-field v-model:model-value="model" v-if="props.field.data_type === 'TEXT'" :rules="[...validationRules]"
        :label="props.field.field_label" :hint="props.field.field_description" persistent-hint variant="outlined"
        :minlength="props.field.validation.min_length || undefined"
        :maxlength="props.field.validation.max_length || undefined" />

    <v-number-input v-model:model-value="model" v-if="props.field.data_type === 'NUMERIC'" :rules="[...validationRules]"
        control-variant="hidden" :label="props.field.field_label" :hint="props.field.field_description" persistent-hint
        variant="outlined" :min="props.field.validation.min_value || undefined"
        :max="props.field.validation.max_value || undefined" />

    <v-card v-if="props.field.data_type === 'BOOLEAN'" :rules="[...validationRules]" variant="text">
        <p class="question-text mb-3">{{ props.field.field_label }}</p>
        <v-btn-toggle v-model:model-value="model" variant="outlined" divided mandatory class="w-100"
            :hint="props.field.field_description" persistent-hint>
            <v-btn color="primary" :value="true" class="flex-grow-1">
                <v-icon start>mdi-check</v-icon>
                Sim
            </v-btn>
            <v-btn color="error" :value="false" class="flex-grow-1">
                <v-icon start>mdi-close</v-icon>
                Não
            </v-btn>
        </v-btn-toggle>
        <span class="text-caption font-weight-medium dark:text-white">{{ props.field.field_description }}</span>
    </v-card>

    <v-text-field v-model:model-value="model" v-if="props.field.data_type === 'DATE'" :rules="[...validationRules]"
        type="date" :label="props.field.field_label" :hint="props.field.field_description" persistent-hint
        variant="outlined" />

    <v-text-field v-model:model-value="model" v-if="props.field.data_type === 'TIME'" :rules="[...validationRules]"
        type="time" :label="props.field.field_label" :hint="props.field.field_description" persistent-hint
        variant="outlined" />

    <v-select v-model:model-value="model" v-if="props.field.data_type === 'SELECT'" :rules="[...validationRules]"
        clearable :label="props.field.field_label" :hint="props.field.field_description" persistent-hint
        variant="outlined" :items="props.field.select_options || []" />

    <v-select v-model:model-value="model" v-if="props.field.data_type === 'MULTISELECT'" :rules="[...validationRules]"
        multiple clearable chips :label="props.field.field_label" :hint="props.field.field_description" persistent-hint
        variant="outlined" :items="props.field.select_options || []" />

</template>