<script setup lang="ts">
import { ref, defineProps, defineModel, watch } from 'vue'

interface PhotoData {
    file: File;
    url: string;
}

const isModalVisible = defineModel<boolean>('isModalVisible', { default: false });

const props = defineProps<{
    titulo: string;
    selectedPhotoKey: string | null;
    foto: PhotoData | undefined;
    removePhoto: (key: any | null) => void;
}>()


const emit = defineEmits(['update:photo'])

const zoomLevel = ref<number>(1);
const rotateLevel = ref<number>(0);
const isLoading = ref<boolean>(false);


function updateZoom(factor: number) {
    const newZoom = zoomLevel.value + factor;
    if (newZoom >= 1 && newZoom <= 3) {
        zoomLevel.value = newZoom;
    }
}

function updateRotation(rotate: number) {
    rotateLevel.value += rotate;
}


async function applyAndSaveRotation() {
    if (!props.selectedPhotoKey || !props.foto?.file.type) {
        isModalVisible.value = false;

        return;
    }

    console.log(props.foto?.file.type);
    console.log(props.foto?.file);


    if (rotateLevel.value % 360 === 0 && props.foto?.file.type === "image/webp") {
        isModalVisible.value = false;
        return;
    }

    isLoading.value = true;
    const photoData = props.foto;

    if (!photoData) {
        isLoading.value = false;
        return;
    }

    try {
        const rotatedFile = await rotateImage(photoData.file, rotateLevel.value);

        const newPhotoData: PhotoData = {
            file: rotatedFile,
            url: URL.createObjectURL(rotatedFile)
        };


        emit('update:photo', props.selectedPhotoKey, newPhotoData);

        // Limpa o URL antigo para evitar vazamento de memória
        URL.revokeObjectURL(photoData.url);

        isModalVisible.value = false;
    } catch (error) {
        console.error("Erro ao rotacionar a imagem:", error);
        isLoading.value = false;

    } finally {
        isLoading.value = false;
    }
}

function rotateImage(file: File, degrees: number): Promise<File> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Não foi possível obter o contexto do canvas.'));
            }

            const radians = degrees * (Math.PI / 180);
            const isSwapped = Math.abs(degrees / 90) % 2 === 1;

            canvas.width = isSwapped ? image.height : image.width;
            canvas.height = isSwapped ? image.width : image.height;

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(radians);

            if (file.type === 'image/jpeg') {
                ctx.fillStyle = 'white';
                ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            }

            ctx.drawImage(image, -image.width / 2, -image.height / 2);

            canvas.toBlob((blob) => {
                if (!blob) {
                    return reject(new Error('Erro ao converter canvas para Blob.'));
                }

                const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                const newFile = new File([blob], newFileName, { type: 'image/webp' });

                resolve(newFile);

            },
                'image/webp',
                0.6
            );

            URL.revokeObjectURL(image.src);
        };

        image.onerror = reject;
    });
}

watch(isModalVisible, (newValue) => {
    if (!newValue) {
        zoomLevel.value = 1;
        rotateLevel.value = 0;
    }
});

</script>

<template>
    <v-dialog v-model="isModalVisible" max-width="95vw" max-height="95vh" class="pa-1" persistent>
        <v-card v-if="props.selectedPhotoKey && foto">
            <v-card-title class="d-flex justify-space-between align-center">
                <span>{{ props.titulo }}</span>
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-0">
                <div class="modal-image-container">
                    <v-img :src="foto?.url" class="modal-image"
                        :style="{ transform: `scale(${zoomLevel}) rotate(${rotateLevel}deg)` }" max-width="100%"
                        max-height="calc(90vh - 150px)" contain />
                </div>
            </v-card-text>
            <v-divider />

            <v-card-actions class="d-flex flex-column justify-space-between align-center px-4">
                <v-btn-toggle class="mb-4" :disabled="isLoading">
                    <v-btn class="mx-2" icon="mdi-rotate-left" @click="updateRotation(-90)" />
                    <v-btn class="mx-2" icon="mdi-rotate-right" @click="updateRotation(90)" />
                    <v-btn class="mx-2" icon="mdi-magnify-minus" @click="updateZoom(-0.2)" :disabled="zoomLevel <= 1" />
                    <v-btn class="mx-2" icon="mdi-magnify-plus" @click="updateZoom(0.2)" :disabled="zoomLevel >= 3" />
                </v-btn-toggle>
                <div class="w-100 d-flex justify-space-between align-center" >
                    <v-btn variant="flat" prepend-icon="mdi-delete" color="error" text="Remover"
                        @click.stop="removePhoto(props.selectedPhotoKey), isModalVisible = false" :disabled="isLoading" />
                    <v-btn variant="flat" prepend-icon="mdi-content-save" color="success"  text="Salvar" @click="applyAndSaveRotation" :loading="isLoading" />
                </div>
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