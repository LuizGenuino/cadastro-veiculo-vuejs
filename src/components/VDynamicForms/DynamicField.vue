<script setup lang="ts">
import { computed, defineProps, defineModel } from 'vue';
import type { CamposExtrasType } from '@/services/http/campos-extras/types';
import { VTextField, VSelect, VNumberInput } from 'vuetify/components';


const model = defineModel<unknown>('model');

const props = defineProps<{
    field: CamposExtrasType
}>();

const patternRegex = computed(() => {
    const pattern = props.field.validation.pattern;
    return pattern ? new RegExp(pattern) : null;
});

const validators = {
    required: (v: any) => !props.field.is_required || !!v || 'Campo obrigatório',
    pattern: (v: string) => !patternRegex.value || !v || patternRegex.value.test(v) || 'Formato do campo inválido.',
    minLength: (v: string) => (props.field.validation.min_length ?? 0) <= (v?.length ?? 0) || `Mínimo de ${props.field.validation.min_length} caracteres.`,
    maxLength: (v: string) => (props.field.validation.max_length === null) || (v?.length ?? 0) <= props.field.validation.max_length || `Máximo de ${props.field.validation.max_length} caracteres.`,
    minValue: (v: number) => (props.field.validation.min_value == null) || v >= props.field.validation.min_value || `Valor mínimo de ${props.field.validation.min_value}.`,
    maxValue: (v: number) => (props.field.validation.max_value == null) || v <= props.field.validation.max_value || `Valor máximo de ${props.field.validation.max_value}.`,
};

const validationRules = computed(() => {
    const rulesMap = {
        is_required: validators.required,
        'validation.pattern': validators.pattern,
        'validation.min_length': validators.minLength,
        'validation.max_length': validators.maxLength,
        'validation.min_value': validators.minValue,
        'validation.max_value': validators.maxValue,
    };

    // Filtra e mapeia apenas as regras que se aplicam ao campo atual.
    return Object.entries(rulesMap)
        .filter(([key]) => {
            // Acessa propriedades aninhadas como 'validation.pattern'
            const keys = key.split('.');
            let value = props.field as any;
            for (const k of keys) {
                if (value === undefined || value === null) return false;
                value = value[k];
            }
            // A regra se aplica se o valor for verdadeiro (is_required) ou existir.
            return !!value;
        })
        .map(([, ruleFn]) => ruleFn);
});


const componentMap: Record<string, any> = {
    TEXT: VTextField,
    NUMERIC: VNumberInput,
    DATE: VTextField,
    TIME: VTextField,
    SELECT: VSelect,
    MULTISELECT: VSelect,
};

const commonProps = computed(() => ({
    label: props.field.field_label,
    hint: props.field.field_description,
    persistentHint: true,
    variant: 'outlined',
    rules: validationRules.value,
}));

const specificProps = computed(() => {
    const type = props.field.data_type;
    switch (type) {
        case 'DATE': return { type: 'date' };
        case 'TIME': return { type: 'time' };
        case 'NUMERIC': return { controlVariant: 'hidden' };
        case 'SELECT': return { items: props.field.select_options || [], clearable: true };
        case 'MULTISELECT': return { items: props.field.select_options || [], clearable: true, multiple: true, chips: true };
        default: return {};
    }
});

const fieldComponent = computed(() => componentMap[props.field.data_type]);

</script>

<template>
    <v-card v-if="props.field.data_type === 'BOOLEAN'" variant="text">
        <p class="question-text mb-1">{{ props.field.field_label }}</p>
        <v-btn-toggle v-model="model" variant="outlined" divided mandatory class="w-100">
            <v-btn color="primary" :value="true" class="flex-grow-1">
                <v-icon start>mdi-check</v-icon> Sim
            </v-btn>
            <v-btn color="error" :value="false" class="flex-grow-1">
                <v-icon start>mdi-close</v-icon> Não
            </v-btn>
        </v-btn-toggle>
        <span class="text-caption font-weight-medium mt-2 d-block text-span">{{ props.field.field_description
        }}</span>
    </v-card>

    <component v-else-if="fieldComponent" :is="fieldComponent" v-model="model"
        v-bind="{ ...commonProps, ...specificProps }" />
</template>