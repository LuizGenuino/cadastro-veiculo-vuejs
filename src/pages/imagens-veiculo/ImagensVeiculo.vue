<script setup lang="ts">
import type { SnackbarType } from '@/utils/types';
import { ref, computed, onUnmounted, watch, inject } from 'vue'
import { useRouter } from 'vue-router'


type PhotoKey = keyof typeof FOTOS_OBRIGATORIAS;

interface PhotoData {
    file: File;
    url: string;
}



const router = useRouter();

const FOTOS_OBRIGATORIAS = {
    painel: { titulo: 'Painel', icon: 'mdi-speedometer' },
    lateralEsquerda: { titulo: 'Lateral Esquerda', icon: 'mdi-motorbike' },
    lateralDireita: { titulo: 'Lateral Direita', icon: 'mdi-motorbike' },
    documento: { titulo: 'Documento', icon: 'mdi-file-document' }
} as const;


const showSnackbar = inject<SnackbarType>('snackbar', () => { });


const fileInputRef = ref<HTMLInputElement | null>(null);
const fotos = ref<Partial<Record<PhotoKey, PhotoData>>>({});


const uploading = ref<Partial<Record<PhotoKey, boolean>>>({});
const uploadProgress = ref<Partial<Record<PhotoKey, number>>>({});


const isModalVisible = ref(false);
const selectedPhotoKey = ref<PhotoKey | null>(null);
const zoomLevel = ref(1);


const isLoading = ref(false);


const formVerification = defineModel<boolean>('formVerification', { default: false });



const totalFotosObrigatorias = computed(() => Object.keys(FOTOS_OBRIGATORIAS).length);
const fotosEnviadasCount = computed(() => Object.keys(fotos.value).length);

const todasFotosEnviadas = computed(() => {
    return fotosEnviadasCount.value === totalFotosObrigatorias.value;
});


watch(todasFotosEnviadas, (newValue) => {
    formVerification.value = newValue;
});


const triggerFileInput = (key: PhotoKey) => {

    fileInputRef.value?.setAttribute('data-photo-key', key);
    fileInputRef.value?.click();
}


const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const key = target.getAttribute('data-photo-key') as PhotoKey | null;

    if (!file || !key) return;

    uploading.value[key] = true;
    uploadProgress.value[key] = 0;

    try {

        for (let progress = 0; progress <= 100; progress += 20) {
            uploadProgress.value[key] = progress;
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        fotos.value[key] = {
            file,
            url: URL.createObjectURL(file)
        };
        showSnackbar('Foto adicionada com sucesso!', 'success');

    } catch (error) {
        console.error("Erro no upload da foto:", error);
        showSnackbar('Erro ao adicionar a foto.', 'error');
    } finally {
        uploading.value[key] = false;

        target.value = '';
        target.removeAttribute('data-photo-key');
    }
}

const removePhoto = (key: PhotoKey) => {
    const photo = fotos.value[key];
    if (photo) {
        URL.revokeObjectURL(photo.url);
        delete fotos.value[key];
        showSnackbar('Foto removida.', 'info');
    }
}

// Métodos do Modal
const openPhotoModal = (key: PhotoKey) => {
    selectedPhotoKey.value = key;
    zoomLevel.value = 1;
    isModalVisible.value = true;
}


const onSubmit = () => {
    if (!todasFotosEnviadas.value) {
        showSnackbar('Por favor, adicione todas as fotos obrigatórias.', 'warning');
        return;
    }
    isLoading.value = true;
    console.log('Enviando fotos:', fotos.value);
    showSnackbar('Cadastro enviado com sucesso!', 'success');
    setTimeout(() => isLoading.value = false, 2000);
    const token = '123';

    router.push({ path: `/imagens-opcionais/${token}` });

}


onUnmounted(() => {
    Object.values(fotos.value).forEach(photo => {
        if (photo?.url) {
            URL.revokeObjectURL(photo.url);
        }
    });
});
</script>

<template>
    <v-form-card v-model:formVerification="formVerification" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Adicione as fotos obrigatórias" submit-text="Próximo" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 3 de 4</v-card-subtitle>
        <v-row>
            <v-col v-for="(fotoInfo, key) in FOTOS_OBRIGATORIAS" :key="key" cols="6">
                <v-card class="photo-upload-card" elevation="0" :variant="fotos[key] ? 'tonal' : 'tonal'">
                    <div v-if="!fotos[key]" class="upload-area">
                        <v-btn variant="text" height="100%" width="100%" @click="triggerFileInput(key)"
                            aria-label="Adicionar foto do painel">
                            <div>
                                <v-icon :icon="fotoInfo.icon" size="48" color="primary" />
                                <h4 class="mt-2 mb-1 text-primary">{{ fotoInfo.titulo }}</h4>
                                <p class="text-caption text-medium-emphasis">Toque para adicionar</p>
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
            Progresso: {{ fotosEnviadasCount }} de {{ totalFotosObrigatorias }} fotos enviadas.
        </p>
        <input ref="fileInputRef" type="file" accept="image/*" capture="environment" style="display: none"
            @change="handleFileSelect" />
    </v-form-card>

    <v-image-dialog :fotos="fotos" v-model:isModalVisible="isModalVisible" :selectedPhotoKey="selectedPhotoKey"
        :removePhoto="removePhoto" :titulo="FOTOS_OBRIGATORIAS[selectedPhotoKey || 'painel'].titulo" />
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