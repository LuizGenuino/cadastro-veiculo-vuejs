<script setup lang="ts">
import { computed, defineProps, defineModel, watch } from 'vue';
import type { CamposExtrasType } from '@/services/http/campos-extras/types';
import { VTextField, VSelect, VNumberInput } from 'vuetify/components';
import type { CamposExtrasValueType } from '@/utils/types';


const model = defineModel<CamposExtrasValueType>('model', { required: true });

const props = defineProps<{
    field: CamposExtrasType,
    isLoading: boolean
}>();


watchEffect(
    () => {
        if (model.value.id == null) {
            model.value = { id: props.field.id, type: props.field.data_type, valor: null };
        } else {
            return
        }
    })

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
    label: `${props.field.field_label}${props.field.is_required ? '*' : ''}`,
    hint: props.field.field_description,
    persistentHint: true,
    variant: 'outlined',
    rules: validationRules.value,
    placeholder: props.field.display.placeholder,
    readonly: props.isLoading,
    loading: props.isLoading
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
        <p class="question-text mb-1 d-flex align-center">{{ props.field.field_label }}{{ props.field.is_required ? '*'
            : '' }}
            <v-tooltip v-if="props.field.display.help_text" :text="props.field.display.help_text" location="bottom">
                <template v-slot:activator="{ props }">
                    <div class="ml-2 border-md text-error  border-error  rounded-pill px-1" v-bind="props">?</div>
                </template>
            </v-tooltip>
        </p>
        <v-radio-group v-model="model.valor" inline v-bind="{ ...commonProps, label: undefined }">
            <v-radio color="success" label="Sim" value="sim"></v-radio>
            <v-radio color="error" label="Não" value="não"></v-radio>
        </v-radio-group>
    </v-card>

    <component v-else-if="fieldComponent" :is="fieldComponent" v-model="model.valor"
        v-bind="{ ...commonProps, ...specificProps }">
        <template #append-inner>
            <v-tooltip v-if="props.field.display.help_text" :text="props.field.display.help_text" location="bottom">
                <template v-slot:activator="{ props }">
                    <div class="border-md text-error  border-error  rounded-pill px-2" v-bind="props">?</div>
                </template>
            </v-tooltip>
        </template>
    </component>
</template>