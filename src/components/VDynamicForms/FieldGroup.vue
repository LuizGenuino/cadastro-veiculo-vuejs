<script setup lang="ts">
import { computed, defineModel, defineProps } from 'vue';
import type { CamposExtrasType } from '@/services/http/campos-extras/types';
import type { CadastroVeiculoType } from '@/stores/types';

const extraFieldsModel = defineModel<Partial<CadastroVeiculoType>>('extraFieldsModel', { required: true });

const props = defineProps<{
    group: { title: string, fields: CamposExtrasType[] },
    isLoading: boolean
}>();


const formValues = computed(() => extraFieldsModel.value.campos_extras || {});

const defineCols = (type: string): number => {
    if (type === "BOOLEAN" || type === "DATE" || type === "TIME ") {
        return 6
    } else {
        return 12
    }
}

</script>

<template>
    <v-row justify="space-between" align="center" v-if="props.group.fields?.length" class="mt-2">
        <v-col cols="12" :md="defineCols(field.data_type)" v-for="field in props.group.fields" :key="field.field_key"
            class="mb-4">
            <dynamic-field :field="field" v-model:model="formValues[field.field_key]" :isLoading="isLoading" />
        </v-col>
    </v-row>
</template>