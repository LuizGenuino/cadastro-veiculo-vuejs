<script setup lang="ts">
import type { CamposExtrasType, MetadataType } from '@/services/http/campos-extras/types';
import type { CadastroVeiculoType } from '@/utils/types';
import { defineProps, onMounted, ref, defineModel } from 'vue';

const extraFieldsModel = defineModel<Partial<CadastroVeiculoType>>('extraFieldsModel')

const props = defineProps<{
    controleDadosExtras: MetadataType,
    camposDadosExtras: CamposExtrasType[],

}>()

const dynamicForm = ref<Record<string, any>>()

const groupedFields = ref<{ title: string, fields: CamposExtrasType[] }[]>()

function organizeFieldsByGroups() {
    if (props.controleDadosExtras && props.controleDadosExtras.groups.length > 0 && props.camposDadosExtras && props.camposDadosExtras.length > 0) {
        const groups = props.controleDadosExtras.groups;
        const fields = props.camposDadosExtras;
        let organized: { title: string, fields: CamposExtrasType[] }[] = [];

        groups.forEach(group => {
            const groupFields = fields.filter(field => field.display.group === group);
            organized.push({ title: group, fields: groupFields.sort((a, b) => a.display.order - b.display.order) });
        });

        console.log(organized);

        groupedFields.value = organized;
    }
}

function createDynamicForm() {
    let formObj: Record<string, any> = {};

    if (
        props.camposDadosExtras &&
        props.camposDadosExtras.length > 0 &&
        extraFieldsModel.value?.campos_extras !== undefined &&
        Object.keys(extraFieldsModel.value?.campos_extras || {}).length > 0
    ) {
        props.camposDadosExtras.forEach(field => {
            formObj[field.field_key] = (extraFieldsModel.value?.campos_extras?.[field.field_key]) ?? undefined;
        });
    }

    dynamicForm.value = formObj;
    if (extraFieldsModel.value) {
        extraFieldsModel.value.campos_extras = dynamicForm.value;
    }
}

onMounted(() => {
    organizeFieldsByGroups();
    createDynamicForm()
})

</script>

<template>
    <div v-if="groupedFields && groupedFields.length > 0">
        <div v-for="(group, index) in groupedFields" :key="index" class="mb-4">
            <v-col cols="12">
                <field-group v-if="group.fields.length > 0" :group="group"
                    v-model:extra-fields-model="extraFieldsModel" />
            </v-col>
        </div>
    </div>
</template>