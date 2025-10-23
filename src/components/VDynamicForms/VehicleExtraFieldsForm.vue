<script setup lang="ts">
import { computed, defineModel, defineProps, watch, ref, onMounted } from 'vue';
import type { CamposExtrasType, MetadataType } from '@/services/http/campos-extras/types';
import type { CadastroVeiculoType } from '@/utils/types';
import { useLoading } from '@/stores/loading';
import { toast } from '@/utils/swal/toast';
import { httpService } from '@/services/http';

const loadingStore = useLoading();
const model = defineModel<Partial<CadastroVeiculoType>>('extraFieldsModel', { required: true });

const props = defineProps<{
    isLoading: boolean;
}>();

const isLoadingFields = ref(true);

const controleDadosExtras = ref<MetadataType>({ total: 0, groups: [] });
const camposDadosExtras = ref<CamposExtrasType[]>([]);
const panel = ref<number[]>([]);

const groupedFields = computed(() => {
    const groups = controleDadosExtras.value.groups;
    const fields = camposDadosExtras.value;

    if (!groups.length || !fields.length) {
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
    if (!model.value || !camposDadosExtras.value.length) {
        return;
    }
    if (!model.value.campos_extras) {
        model.value.campos_extras = {};
    }
    const currentExtras = model.value.campos_extras;
    camposDadosExtras.value.forEach(field => {
        if (!(field.field_key in currentExtras)) {
            currentExtras[field.field_key] = undefined;
        }
    });
});


watch(
    () => controleDadosExtras.value.groups,
    (newGroups) => {
        if (newGroups && newGroups.length > 0) {
            panel.value = [...Array(newGroups.length).keys()];
        }
    },
    { once: true }
);

async function fetchVehicleExtraFields() {
    loadingStore.show('Carregando campos extras...');
    
    isLoadingFields.value = true;

    try {
        const response = await httpService.camposExtras.list();
        if (response.isRight()) {
            controleDadosExtras.value = response.value?.control.metadata as MetadataType;
            camposDadosExtras.value = response.value?.data as CamposExtrasType[];
        }
    } catch (error) {
        console.error("Erro ao buscar campos extras:", error);
        toast('Ocorreu um erro ao carregar os campos extras.', 'error');
    } finally {
        loadingStore.hidden();
        isLoadingFields.value = false;
    }
}

onMounted(() => {
    fetchVehicleExtraFields();
});

</script>

<template>
    <v-skeleton-loader v-if="isLoadingFields" type="card@3"></v-skeleton-loader>

    <div v-else-if="groupedFields.length > 0">
        <v-expansion-panels v-model="panel" variant="popout" multiple>
            <v-expansion-panel v-for="group in groupedFields" :key="group.title" class="mb-4">
                <v-expansion-panel-title class="text-subtitle-1 font-weight-bold">
                    {{ group.title }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <field-group v-if="group.fields.length > 0" :group="group" v-model:extra-fields-model="model"
                        :isLoading="props.isLoading" />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>

    <div v-else class="text-center text-grey pa-4">
        <p>Nenhum campo extra encontrado.</p>
    </div>
</template>