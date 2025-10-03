<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

import SuccessDialog from './components/SuccessDialog.vue';
import { useLoading } from '@/stores/loading';
import { toast } from '@/utils/swal/toast';
import { FOTOS_OPCIONAIS, type CadastroVeiculoType, type optionalPhotosKey, type PhotoData } from '@/utils/types';
import { useVeiculo } from '@/stores/veiculo';


const form = ref<Partial<CadastroVeiculoType>>({});

const fileInputRef = ref<HTMLInputElement | null>(null);
const fotos = ref<Partial<Record<optionalPhotosKey, PhotoData>>>({});


const uploading = ref<Partial<Record<optionalPhotosKey, boolean>>>({});
const uploadProgress = ref<Partial<Record<optionalPhotosKey, number>>>({});


const isModalVisible = ref(false);
const isSuccessModalVisible = ref(false)
const selectedPhotoKey = ref<optionalPhotosKey | null>(null);

const isLoading = ref(false);
const isUploading = ref<boolean>(false);

const totalFotosOpcionais = computed(() => Object.keys(FOTOS_OPCIONAIS).length);
const fotosEnviadasCount = computed(() => Object.keys(fotos.value).length);


const triggerFileInput = (key: optionalPhotosKey) => {

    fileInputRef.value?.setAttribute('data-photo-key', key);
    fileInputRef.value?.click();
}

function handlePhotoUpdate(key: optionalPhotosKey, newPhotoData: PhotoData) {
    if (fotos.value[key]) {
        fotos.value[key] = newPhotoData;
    }
}


const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const key = target.getAttribute('data-photo-key') as optionalPhotosKey | null;

    if (!file || !key) return;

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

const removePhoto = (key: optionalPhotosKey) => {
    const photo = fotos.value[key];
    if (photo) {
        URL.revokeObjectURL(photo.url);
        delete fotos.value[key];
    }
}


const openPhotoModal = (key: optionalPhotosKey) => {
    selectedPhotoKey.value = key;
    isModalVisible.value = true;
}

const onSubmit = async () => {
    try {
        useLoading().show("Enviando Fotos Opcionais...")
        isLoading.value = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        form.value.fotos_opcionais = { ...fotos.value };
        form.value.etapa_atual = null;

        await useVeiculo().clear();

        useLoading().hidden()
         toast('Cadastro enviado com sucesso!', 'success');
          isSuccessModalVisible.value = true
    } catch (error) {
        console.error('Falha ao buscar veículo:', error);
        toast('Não foi possível encontrar o veículo. Tente novamente.', 'error');
    } finally {
        useLoading().hidden()
        isLoading.value = false;
    }
}

onMounted(() => {
    const data: Partial<CadastroVeiculoType> = useVeiculo().get();
    form.value = { ...data };
    if (data.fotos_opcionais) {
        fotos.value = { ...data.fotos_opcionais };
    }
});

onUnmounted(() => {
    Object.values(fotos.value).forEach(photo => {
        if (photo?.url) {
            URL.revokeObjectURL(photo.url);
        }
    });
});
</script>

<template>
    <v-form-card :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Adicione fotos extras para valorizar seu anúncio" submit-text="Salvar e Finalizar"
        @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 4 de 4</v-card-subtitle>
        <v-row>
            <v-col v-for="(fotoInfo, key) in FOTOS_OPCIONAIS" :key="key" cols="6">
                <v-card class="photo-upload-card" elevation="0" :variant="fotos[key] ? 'tonal' : 'tonal'">
                    <div v-if="!fotos[key]" class="upload-area">
                        <v-btn :disabled="isUploading" variant="text" height="100%" width="100%"
                            @click="triggerFileInput(key)" aria-label="Adicionar foto do painel">
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
            Progresso: {{ fotosEnviadasCount }} de {{ totalFotosOpcionais }} fotos enviadas.
        </p>
        <input ref="fileInputRef" type="file" accept="image/*" capture="environment" style="display: none"
            @change="handleFileSelect" />
    </v-form-card>

    <v-image-dialog v-if="selectedPhotoKey" :foto="fotos[selectedPhotoKey]" v-model:isModalVisible="isModalVisible"
        :selectedPhotoKey="selectedPhotoKey" :removePhoto="removePhoto"
        :titulo="FOTOS_OPCIONAIS[selectedPhotoKey].titulo" @update:photo="handlePhotoUpdate" />

    <SuccessDialog :is-modal-visible="isSuccessModalVisible"></SuccessDialog>
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