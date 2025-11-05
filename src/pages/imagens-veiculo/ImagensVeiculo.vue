<script setup lang="ts">
import { httpService } from '@/services/http';
import { useLoading } from '@/stores/loading';
import { useVeiculo } from '@/stores/veiculo';
import { toast } from '@/utils/swal/toast';
import { FOTOS_OBRIGATORIAS, type CadastroVeiculoType, type PhotoData, type PhotoInfo, type requiredPhotosKey } from '@/utils/types';
import { ref, computed, watch, defineModel } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter();

const form = ref<Partial<CadastroVeiculoType>>({});

const fotos = ref<Partial<Record<requiredPhotosKey, PhotoData>>>({});

const isLoading = ref<boolean>(false);

const formVerification = defineModel<boolean>('formVerification', { default: false });



const totalFotosObrigatorias = computed(() => Object.keys(FOTOS_OBRIGATORIAS).length);
const fotosEnviadasCount = computed(() => Object.keys(fotos.value).length);

const todasFotosEnviadas = computed(() => {
    return fotosEnviadasCount.value === totalFotosObrigatorias.value;
});


watch(todasFotosEnviadas, (newValue) => {
    formVerification.value = newValue;
});

const onSubmit = async () => {
    try {
        if (!todasFotosEnviadas.value) {
            toast('Por favor, adicione todas as fotos obrigatórias.', 'warning');
            return;
        }

        const arrayFotos = Object.entries(fotos.value) as Array<[requiredPhotosKey, PhotoData | undefined]>;

        const verifyPhoto = arrayFotos.some(([key, photo]) => {
            return !photo?.file && photo?.url;
        });

        if (verifyPhoto) {
            const token = router.currentRoute.value.params as { token?: string }
            router.push({ path: `/imagens-opcionais/${token.token}` });
            return;
        }


        const verifyType = arrayFotos.some(([key, photo]) => {
            return !photo?.file || photo.file.type.indexOf('image/webp') === -1;
        });

        if (verifyType) {
            toast('Falha no upload - tente novamente', 'error');
            return;
        }

        useLoading().show("Enviando Fotos Obrigatorias...")
        isLoading.value = true;

        let ordem = 0;
        let fotosEnviadas: PhotoInfo[] = [];
        for (const [key, photo] of arrayFotos) {
            if (photo?.file) {

                ordem++;
                const isDocs = key.includes('documento');
                const formData = new FormData();
                formData.append('ordem', ordem.toString());
                formData.append('is_doc', isDocs.toString());
                formData.append('thumbnails', (!isDocs).toString());
                formData.append('vehicle_id', form.value.id?.toString() || '');
                formData.append('arquivo', photo.file);

                const response = await httpService.midia.upload(formData);

                if (response.isRight() && response.value) {
                    fotos.value[key] = {
                        file: null,
                        url: response.value.image_url
                    }
                    fotosEnviadas.push({
                        id: response.value.id,
                        key: key,
                        descricao: response.value.descricao,
                        image_url: response.value.image_url,
                        is_primary: response.value.is_primary,
                        is_doc: response.value.is_doc,
                        thumbnails: response.value.thumbnails,
                        display_order: response.value.display_order,
                    });
                }
            }
        }

        form.value.fotos_obrigatorias = fotosEnviadas;



        form.value.etapa_atual = 'imagens-opcionais';

        await useVeiculo().set(form.value as CadastroVeiculoType);

        useLoading().hidden()
        toast('Imagens Cadastrada com Sucesso!', 'success');
        const token = router.currentRoute.value.params as { token?: string }
        router.push({ path: `/imagens-opcionais/${token.token}` });
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

    if (data.fotos_obrigatorias && data.fotos_obrigatorias.length > 0) {
        data.fotos_obrigatorias.forEach(photoInfo => {
            const key = photoInfo.key as requiredPhotosKey;
            fotos.value[key] = {
                file: null,
                url: photoInfo.image_url
            };
        });
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
    <registration-information :form="form" />
    <v-form-card v-model:formVerification="formVerification" :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Adicione as fotos obrigatórias" submit-text="Próximo" @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 3 de 4</v-card-subtitle>
        <v-image-upload-gallery v-model:fotos="fotos" :objeto-fotos="FOTOS_OBRIGATORIAS" />
    </v-form-card>
</template>

<style scoped></style>