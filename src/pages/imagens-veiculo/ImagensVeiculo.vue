<script setup lang="ts">
import { useLoading } from '@/stores/loading';
import { toast } from '@/utils/swal/toast';
import type { CadastroVeiculoType } from '@/utils/types';
import { ref, computed, onUnmounted, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'


type PhotoKey = keyof typeof FOTOS_OBRIGATORIAS;

interface PhotoData {
    file: File;
    url: string;
}



const router = useRouter();
const route = useRoute();

const FOTOS_OBRIGATORIAS = {
    painel: { titulo: 'Painel', icon: 'mdi-speedometer', class: "" },
    lateralEsquerda: { titulo: 'Lateral Esquerda', icon: 'mdi-motorbike', class: "" },
    lateralDireita: { titulo: 'Lateral Direita', icon: 'mdi-motorbike', class: "mdi-flip-h" },
    documento: { titulo: 'Documento', icon: 'mdi-file-document', class: "" }
} as const;

const form = ref<CadastroVeiculoType>({
    loja_usuario: '',
    placa_ou_chassi: '',
    nome_proprietario: '',
    telefone_proprietario: '',
    marca: '',
    modelo: '',
    ano: '',
    valor_fipe: '',
    placa: '',
    id_veiculo_fipe: '',
    valorDesejado: 0,
    kmRodado: 0,
    estadoConservacao: "",
    motivoVenda: "",
});


const fileInputRef = ref<HTMLInputElement | null>(null);
const fotos = ref<Partial<Record<PhotoKey, PhotoData>>>({});


const uploading = ref<Partial<Record<PhotoKey, boolean>>>({});
const uploadProgress = ref<Partial<Record<PhotoKey, number>>>({});


const isModalVisible = ref<boolean>(false);
const selectedPhotoKey = ref<PhotoKey | null>(null);


const isLoading = ref<boolean>(false);
const isUploading = ref<boolean>(false);



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

function handlePhotoUpdate(key: PhotoKey, newPhotoData: PhotoData) {
    if (fotos.value[key]) {
        fotos.value[key] = newPhotoData;
    }
}

const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const key = target.getAttribute('data-photo-key') as PhotoKey | null;

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

        toast('Foto adicionada com sucesso!', 'success');
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

const removePhoto = (key: PhotoKey) => {
    const photo = fotos.value[key];
    if (photo) {
        URL.revokeObjectURL(photo.url);
        delete fotos.value[key];
        toast('Foto removida.', 'info');
    }
}


const openPhotoModal = (key: PhotoKey) => {
    selectedPhotoKey.value = key;
    isModalVisible.value = true;
}


const onSubmit = async () => {
    if (!todasFotosEnviadas.value) {
        toast('Por favor, adicione todas as fotos obrigatórias.', 'warning');
        return;
    }
    useLoading().show("Enviando Fotos Obrigatorias...")
    isLoading.value = true;
    console.log('Enviando fotos:', fotos.value);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast('Cadastro enviado com sucesso!', 'success');
    const token = '123';
    const veiculo = JSON.stringify({ ...form.value });
    useLoading().hidden()


    router.push({ path: `/imagens-opcionais/${token}`, query: { veiculo }, replace: true });

}

onMounted(() => {
    form.value = JSON.parse(route.query.veiculo as string);
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
    <v-form-card v-model:formVerification="formVerification" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Adicione as fotos obrigatórias" submit-text="Próximo" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 3 de 4</v-card-subtitle>
        <v-row>
            <v-col v-for="(fotoInfo, key) in FOTOS_OBRIGATORIAS" :key="key" cols="6">
                <v-card class="photo-upload-card" elevation="0" :variant="fotos[key] ? 'tonal' : 'tonal'">
                    <div v-if="!fotos[key]" class="upload-area">
                        <v-btn :disabled="isUploading" variant="text" height="100%" width="100%"
                            @click="triggerFileInput(key)" aria-label="Adicionar foto do painel">
                            <div>
                                <v-icon :icon="fotoInfo.icon" size="48" color="primary" :class="fotoInfo?.class" />
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

    <v-image-dialog v-if="selectedPhotoKey" :foto="fotos[selectedPhotoKey]" v-model:isModalVisible="isModalVisible"
        :selectedPhotoKey="selectedPhotoKey" :removePhoto="removePhoto"
        :titulo="FOTOS_OBRIGATORIAS[selectedPhotoKey].titulo" @update:photo="handlePhotoUpdate" />
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