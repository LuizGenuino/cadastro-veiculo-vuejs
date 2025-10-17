<script setup lang="ts">
import { computed, defineModel, defineProps, watchEffect, ref } from 'vue';
import type { CamposExtrasType, MetadataType } from '@/services/http/campos-extras/types';
import type { CadastroVeiculoType } from '@/utils/types';

const model = defineModel<Partial<CadastroVeiculoType>>('extraFieldsModel', { required: true });

const props = defineProps<{
    controleDadosExtras: MetadataType,
    camposDadosExtras: CamposExtrasType[],
    isLoading: boolean
}>();

const panel = ref<number[]>([])

const groupedFields = computed(() => {
    const groups = props.controleDadosExtras?.groups;
    const fields = props.camposDadosExtras;

    if (!groups?.length || !fields?.length) {
        return [];
    }

    return groups.map((groupTitle) => {
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

onMounted(() => {
    const groups = props.controleDadosExtras?.groups || [];
    panel.value = Array.from({ length: groups.length }, (_, index) => index);
})

</script>

<template>
    <div v-if="groupedFields.length > 0">
        <v-expansion-panels v-model="panel" variant="popout" multiple>
            <v-expansion-panel v-for="group in groupedFields" :key="group.title" class="mb-4">
                <v-expansion-panel-title class="text-subtitle-1 font-weight-bold">
                    {{ group.title }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <field-group v-if="group.fields.length > 0" :group="group" v-model:extra-fields-model="model"
                        :isLoading="isLoading" />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>