<script setup lang="ts">
import { computed, defineModel, defineProps, watchEffect } from 'vue';
import type { CamposExtrasType, MetadataType } from '@/services/http/campos-extras/types';
import type { CadastroVeiculoType } from '@/utils/types';

const model = defineModel<Partial<CadastroVeiculoType>>('extraFieldsModel', { required: true });

const props = defineProps<{
    controleDadosExtras: MetadataType,
    camposDadosExtras: CamposExtrasType[],
}>();

const groupedFields = computed(() => {
    const groups = props.controleDadosExtras?.groups;
    const fields = props.camposDadosExtras;

    if (!groups?.length || !fields?.length) {
        return [];
    }

    return groups.map(groupTitle => {
        const groupFields = fields
            .filter(field => field.display.group === groupTitle)
            .sort((a, b) => a.display.order - b.display.order);

        return { title: groupTitle, fields: groupFields };
    });
});


watchEffect(() => {
    if (!model.value || !props.camposDadosExtras?.length) {
        return;
    }

    if (!model.value.campos_extras) {
        model.value.campos_extras = {};
    }

    const currentExtras = model.value.campos_extras;

    props.camposDadosExtras.forEach(field => {
        if (!(field.field_key in currentExtras)) {
            currentExtras[field.field_key] = undefined;
        }
    });
});

</script>

<template>
    <div v-if="groupedFields.length > 0">
        <div v-for="group in groupedFields" :key="group.title" class="mb-4">
            <field-group v-if="group.fields.length > 0" :group="group" v-model:extra-fields-model="model" />
        </div>
    </div>
</template>