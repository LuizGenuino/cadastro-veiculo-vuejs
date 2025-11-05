<script setup lang="ts">
import { toast } from '@/utils/swal/toast';
import { type PhotoData } from '@/utils/types';
import { ref, computed, watch, defineModel } from 'vue'

type objetoFotosType = {
    titulo: string;
    icon: string;
    class?: string;
}

const fotos = defineModel<Record<string, PhotoData>>('fotos', { default: {} });

const formVerification = defineModel<boolean>('formVerification', { default: false });

const props = defineProps<{
    objetoFotos: Record<string, objetoFotosType>;
}>()

const draggingKey = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null);

const uploading = ref<Partial<Record<string, boolean>>>({});
const uploadProgress = ref<Partial<Record<string, number>>>({});


const isModalVisible = ref<boolean>(false);
const selectedPhotoKey = ref<string | null>(null);

const isUploading = ref<boolean>(false);



const totalFotos = computed(() => Object.keys(props.objetoFotos).length);
const fotosEnviadasCount = computed(() => Object.keys(fotos.value).length);

const todasFotosEnviadas = computed(() => {
    return fotosEnviadasCount.value === totalFotos.value;
});


watch(todasFotosEnviadas, (newValue) => {
    formVerification.value = newValue;
});


const triggerFileInput = (key: string) => {

    fileInputRef.value?.setAttribute('data-photo-key', key);
    fileInputRef.value?.click();
}

const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const key = target.getAttribute('data-photo-key') as string | null;

    if (!file || !key) return;

    if (file.type.indexOf('image/') === -1) {
        toast('Tipo de arquivo não suportado', 'warning');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        toast('Arquivo muito grande (máximo 10MB)', 'warning');
        return;
    }

    uploading.value[key] = true;
    uploadProgress.value[key] = 0;
    isUploading.value = true

    try {

        for (let progress = 0; progress <= 100; progress += 20) {
            uploadProgress.value[key] = progress;
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        fotos.value[key] = {
            file,
            url: URL.createObjectURL(file)
        };
        openPhotoModal(key)

    } catch (error) {
        console.error("Erro no upload da foto:", error);
        toast('Erro ao adicionar a foto.', 'error');
        isUploading.value = false
    } finally {
        uploading.value[key] = false;
        isUploading.value = false
        target.value = '';
        target.removeAttribute('data-photo-key');
    }
}

const handleFileDrop = async (event: DragEvent, key: string) => {
    event.preventDefault()
    draggingKey.value = null

    const file = event.dataTransfer?.files?.[0]
    if (!file) return

    // simular o mesmo comportamento do input
    const fakeInput = document.createElement('input')
    fakeInput.setAttribute('data-photo-key', key)
    const evt = { target: { files: [file], getAttribute: () => key, value: '' } } as unknown as Event
    handleFileSelect(evt)
}

const handleDragOver = (event: DragEvent, key: string) => {
    event.preventDefault()
    draggingKey.value = key
}

const handleDragLeave = () => {
    draggingKey.value = null
}


const removePhoto = (key: string) => {
    const photo = fotos.value[key];
    if (photo?.file && photo.url) {
        URL.revokeObjectURL(photo.url);
        delete fotos.value[key];
    }
}

function handlePhotoUpdate(key: string, newPhotoData: PhotoData) {
    if (fotos.value[key]) {
        fotos.value[key] = newPhotoData;
    }
}


const openPhotoModal = (key: string) => {
    selectedPhotoKey.value = key;
    isModalVisible.value = true;
}


</script>

<template>
    <div>
        <v-row>
            <v-col v-for="(fotoInfo, key) in props.objetoFotos" :key="key" cols="6">
                <v-card class="photo-upload-card" elevation="0" :variant="fotos[key] ? 'tonal' : 'tonal'"
                    @dragover.prevent="handleDragOver($event, key)" @dragleave="handleDragLeave"
                    @drop="handleFileDrop($event, key)" :class="{ 'dragging': draggingKey === key }">
                    <div v-if="!fotos[key]" class="upload-area">
                        <v-btn :disabled="isUploading" variant="text" height="100%" width="100%"
                            @click="triggerFileInput(key)" aria-label="Adicionar foto do painel">
                            <div>
                                <v-icon :icon="fotoInfo.icon" size="48" color="primary" :class="fotoInfo?.class" />
                                <h4 class="mt-2 mb-1 text-primary">{{ fotoInfo.titulo }}</h4>
                                <p class="text-caption text-medium-emphasis">
                                    Toque ou arraste uma imagem aqui
                                </p>
                            </div>
                        </v-btn>

                        <v-progress-linear v-if="uploading[key]" :model-value="uploadProgress[key]" color="primary"
                            height="4" absolute bottom />
                    </div>

                    <div v-else class="photo-preview">
                        <v-img :src="fotos[key]?.url" :alt="fotoInfo.titulo" aspect-ratio="1" cover
                            class="preview-image" @click="openPhotoModal(key)" />
                        <div class="photo-overlay">
                            <v-btn icon="mdi-delete" size="small" color="error" variant="flat"
                                @click.stop="removePhoto(key)" aria-label="Remover foto" />
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <p class="text-medium-emphasis text-body-2 mb-4">
            Progresso: {{ Object.keys(fotos).length }} de {{ Object.keys(props.objetoFotos).length }} fotos enviadas.
        </p>

        <input ref="fileInputRef" type="file" accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .heic, .webp, .svg"
            capture="environment" style="display: none" @change="handleFileSelect" />
    </div>
    <v-image-dialog v-if="selectedPhotoKey" :foto="fotos[selectedPhotoKey]" v-model:isModalVisible="isModalVisible"
        :selectedPhotoKey="selectedPhotoKey" :removePhoto="removePhoto"
        :titulo="props.objetoFotos[selectedPhotoKey].titulo" @update:photo="handlePhotoUpdate" />
</template>

<style scoped>
.photo-upload-card {
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
}

.upload-area {
    height: 100%;
    width: 100%;
    position: relative;
}

.upload-area .v-btn {
    text-transform: none;
    letter-spacing: normal;
}

.photo-preview {
    position: relative;
    height: 100%;
    cursor: pointer;
}

.preview-image {
    width: 100%;
    height: 100%;
}

.photo-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
}

.photo-preview:hover .photo-overlay {
    opacity: 1;
}
</style>