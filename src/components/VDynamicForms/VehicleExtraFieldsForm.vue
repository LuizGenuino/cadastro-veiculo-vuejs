<script setup lang="ts">
import type { CamposExtrasType, MetadataType } from '@/services/http/campos-extras/types';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps<{
    controleDadosExtras: MetadataType,
    camposDadosExtras: CamposExtrasType[],
}>()

const groupedFields = ref<{ title: string, fields: CamposExtrasType[] }[]>()

function organizeFieldsByGroups() {
    if (props.controleDadosExtras && props.controleDadosExtras.groups.length > 0 && props.camposDadosExtras && props.camposDadosExtras.length > 0) {
        const groups = props.controleDadosExtras.groups;
        const fields = props.camposDadosExtras;
        let organized: { title: string, fields: CamposExtrasType[] }[] = [];

        groups.forEach(group => {
            const groupFields = fields.filter(field => field.display.group === group);
            organized.push({ title: group, fields: groupFields });
        });

        console.log(organized);

        groupedFields.value = organized;
    }
}

onMounted(() => {
    organizeFieldsByGroups();
})

</script>

<template>
    <div v-if="groupedFields && groupedFields.length > 0">
        <div v-for="(group, index) in groupedFields" :key="index" class="mb-4">
             <v-col cols="12">
                 <field-group v-if="group.fields.length > 0" :group="group " />  
             </v-col>
        </div>
    </div>
</template>