<script setup lang="ts">
import type { SnackbarType } from '@/utils/types';
import { ref, computed, onUnmounted, watch, inject } from 'vue'
import { useRouter } from 'vue-router'


// --- INTERFACES E TIPOS ---
// Define um tipo para as chaves das fotos, tornando o código mais seguro e legível.
type PhotoKey = keyof typeof FOTOS_OPCIONAIS;

// Define a estrutura de um objeto de foto.
interface PhotoData {
    file: File;
    url: string;
}


const router = useRouter();

// --- CONFIGURAÇÃO ---
// Constantes em maiúsculo para indicar que são valores fixos de configuração.
const FOTOS_OPCIONAIS = {
    frente: { titulo: 'Frente', icon: 'mdi-motorbike' },
    tras: { titulo: 'Tras', icon: 'mdi-card-text' },
    pneuTraseiro: { titulo: 'Pneu Traseiro', icon: 'mdi-tire' },
    pneuDianteiro: { titulo: 'Pneu Dianteiro', icon: 'mdi-tire' },
    motor: { titulo: 'Motor', icon: 'mdi-engine' }
} as const; // `as const` garante que as chaves sejam literais e não apenas strings.

// --- INJEÇÃO DE DEPENDÊNCIAS ---
const showSnackbar = inject<SnackbarType>('snackbar', () => { }); // Fornece um fallback para evitar erros.

// --- ESTADO REATIVO (Refs) ---
const fileInputRef = ref<HTMLInputElement | null>(null);
const fotos = ref<Partial<Record<PhotoKey, PhotoData>>>({});

// Estado para controle de upload
const uploading = ref<Partial<Record<PhotoKey, boolean>>>({});
const uploadProgress = ref<Partial<Record<PhotoKey, number>>>({});

// Estado para o modal de visualização
const isModalVisible = ref(false);
const selectedPhotoKey = ref<PhotoKey | null>(null);
const zoomLevel = ref(1);

// Estado do formulário
const isLoading = ref(false);

// V-model para o componente pai
const formVerification = defineModel<boolean>('formVerification', { default: false });


// --- PROPRIEDADES COMPUTADAS ---
const totalFotosOpcionais = computed(() => Object.keys(FOTOS_OPCIONAIS).length);
const fotosEnviadasCount = computed(() => Object.keys(fotos.value).length);

const todasFotosEnviadas = computed(() => {
    return fotosEnviadasCount.value === totalFotosOpcionais.value;
});

// Atualiza o v-model para o componente pai sempre que o status das fotos mudar.
watch(todasFotosEnviadas, (newValue) => {
    formVerification.value = newValue;
});

// --- MÉTODOS ---

// Aciona o input de arquivo oculto
const triggerFileInput = (key: PhotoKey) => {
    // Guarda a chave da foto que está sendo adicionada
    fileInputRef.value?.setAttribute('data-photo-key', key);
    fileInputRef.value?.click();
}

// Lida com a seleção do arquivo
const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const key = target.getAttribute('data-photo-key') as PhotoKey | null;

    if (!file || !key) return;

    uploading.value[key] = true;
    uploadProgress.value[key] = 0;

    try {
        // Simula o progresso do upload. Em um caso real,
        // isso seria substituído por uma chamada de API (ex: Axios com onUploadProgress).
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
        // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente.
        target.value = '';
        target.removeAttribute('data-photo-key');
    }
}

const removePhoto = (key: PhotoKey) => {
    const photo = fotos.value[key];
    if (photo) {
        URL.revokeObjectURL(photo.url); // Libera a memória do objeto URL.
        delete fotos.value[key];
        showSnackbar('Foto removida.', 'info');
    }
}

// Métodos do Modal
const openPhotoModal = (key: PhotoKey) => {
    selectedPhotoKey.value = key;
    zoomLevel.value = 1; // Reseta o zoom ao abrir
    isModalVisible.value = true;
}

// Lida com o envio do formulário
const onSubmit = () => {
    if (!todasFotosEnviadas.value) {
        showSnackbar('Por favor, adicione todas as fotos opcionais.', 'warning');
        return;
    }
    isLoading.value = true;
    // Lógica de envio para o backend aqui...
    console.log('Enviando fotos:', fotos.value);
    showSnackbar('Cadastro enviado com sucesso!', 'success');
    // router.push({ name: 'ProximaPagina' });
    setTimeout(() => isLoading.value = false, 2000); // Simula loading

    const token = '123';

    router.push({ path: `/${token}` });

}

// --- LIFECYCLE HOOKS ---
// Garante que todos os Object URLs sejam revogados para evitar vazamentos de memória.
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
        card-subtitle="Adicione fotos extras para valorizar seu anúncio" submit-text="Salvar e Finalizar"
        @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 4 de 4</v-card-subtitle>
        <v-row>
            <v-col v-for="(fotoInfo, key) in FOTOS_OPCIONAIS" :key="key" cols="6">
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
            Progresso: {{ fotosEnviadasCount }} de {{ totalFotosOpcionais }} fotos enviadas.
        </p>
        <input ref="fileInputRef" type="file" accept="image/*" capture="environment" style="display: none"
            @change="handleFileSelect" />
    </v-form-card>

    <v-image-dialog :fotos="fotos" v-model:isModalVisible="isModalVisible" :selectedPhotoKey="selectedPhotoKey"
        :removePhoto="removePhoto" :titulo="FOTOS_OPCIONAIS[selectedPhotoKey || 'frente'].titulo" />
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