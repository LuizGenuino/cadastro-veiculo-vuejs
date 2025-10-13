<script setup lang="ts">
import type { CamposExtrasType, } from '@/services/http/campos-extras/types';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps<{
    group: { title: string, fields: CamposExtrasType[] }
}>()


onMounted(() => {

})

</script>

<template>
    <p class="text-subtitle-1 font-weight-bold">{{ props.group.title || "" }}</p>
    <div v-if="group.fields && group.fields.length > 0" class="mt-2">
        <div v-for="(field, index) in group.fields" :key="index" class="mb-4">
            <v-col cols="12">
                <dynamic-field :field="field" />
            </v-col>
        </div>
    </div>
</template>