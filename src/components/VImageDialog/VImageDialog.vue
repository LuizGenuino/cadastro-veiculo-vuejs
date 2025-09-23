<script setup lang="ts">
import { ref, defineProps, defineModel } from 'vue'


interface PhotoData {
    file: File;
    url: string;
}


const isModalVisible = defineModel<boolean>('isModalVisible', { default: false });

const props = defineProps<{
    titulo: string;
    selectedPhotoKey: string | null;
    fotos: Partial<Record<string, PhotoData>>;
    removePhoto: (key: any | null) => void;
}>()

const zoomLevel = ref<number>(1);
const rotateLevel = ref<number>(0)


function updateZoom(factor: number) {
    const newZoom = zoomLevel.value + factor;
    if (newZoom >= 1 && newZoom <= 3) {
        zoomLevel.value = newZoom;
    }
}

function updateRotation(rotate: number) {
    const newRotate = rotateLevel.value + rotate
    rotateLevel.value = newRotate
}

</script>

<template>
    <v-dialog v-model="isModalVisible" max-width="95vw" max-height="95vh" class="pa-1">
        <v-card v-if="props.selectedPhotoKey && fotos[props.selectedPhotoKey]">
            <v-card-title class="d-flex justify-space-between align-center">
                <span>{{ props.titulo }}</span>
                <v-btn icon="mdi-close" variant="text" @click="isModalVisible = false" />
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-0">
                <div class="modal-image-container">
                    <v-img :src="fotos[props.selectedPhotoKey]?.url" class="modal-image"
                        :style="{ transform: `scale(${zoomLevel}) rotate(${rotateLevel}deg)`}" max-width="100%" max-height="calc(90vh - 150px)"
                        contain />
                </div>
            </v-card-text>
            <v-divider />

            <v-card-actions class="justify-center">
                <v-btn-toggle>
                    <v-btn icon="mdi-rotate-left" @click="updateRotation(-90)" />
                    <v-btn icon="mdi-magnify-minus" @click="updateZoom(-0.2)" :disabled="zoomLevel <= 1" />
                    <v-btn icon="mdi-image-filter-center-focus" @click="zoomLevel = 1" />
                    <v-btn icon="mdi-magnify-plus" @click="updateZoom(0.2)" :disabled="zoomLevel >= 3" />
                    <v-btn icon="mdi-rotate-right" @click="updateRotation(90)"/>
                </v-btn-toggle>
                <v-btn class="position-absolute right-0" icon="mdi-delete" color="error" variant="text"
                    @click.stop="removePhoto(props.selectedPhotoKey), isModalVisible = false"
                    aria-label="Remover foto" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.modal-image-container {
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff00;
}

.modal-image {
    transition: transform 0.2s ease;
    transform-origin: center;
    cursor: grab;
}
</style>