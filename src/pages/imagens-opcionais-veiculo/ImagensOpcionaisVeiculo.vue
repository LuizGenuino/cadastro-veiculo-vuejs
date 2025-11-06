<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

import SuccessDialog from './components/SuccessDialog.vue';
import { useLoading } from '@/stores/loading';
import { toast } from '@/utils/swal/toast';
import { FOTOS_OPCIONAIS, type CadastroVeiculoType, type chavesFotosOpcionaisType, type InfoFotosType, type ObjetoFotoType } from '@/stores/types';
import { useVeiculo } from '@/stores/veiculo';
import { httpService } from '@/services/http';


const form = ref<Partial<CadastroVeiculoType>>({});

const fotos = ref<Partial<Record<chavesFotosOpcionaisType, ObjetoFotoType>>>({});


const isSuccessModalVisible = ref(false)

const isLoading = ref(false);



const onSubmit = async () => {
    try {
        useLoading().show("Enviando Fotos Opcionais...")
        isLoading.value = true;

        const arrayFotos = Object.entries(fotos.value) as Array<[chavesFotosOpcionaisType, ObjetoFotoType | undefined]>;

        if (arrayFotos.length === 0) {
            await useVeiculo().clear();
            useLoading().hidden()
            toast('Cadastro sem fotos enviado com sucesso!', 'success');
            isSuccessModalVisible.value = true
            return;
        }

        const verifyPhoto = arrayFotos.some(([key, photo]) => {
            return !photo?.file && photo?.url;
        });

        if (verifyPhoto) {
            await useVeiculo().clear();
            useLoading().hidden()
            toast('As imagens ja foram enviadas!', 'info');
            isSuccessModalVisible.value = true
        }


        const verifyType = arrayFotos.some(([key, photo]) => {
            return !photo?.file || photo.file.type.indexOf('image/webp') === -1;
        });

        if (verifyType) {
            toast('Falha no upload - tente novamente', 'error');
            return;
        }

        isLoading.value = true;

        let ordem = 0;
        let fotosEnviadas: InfoFotosType[] = [];
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

                const response = await httpService.midia.salvarImagem(formData);

                if (response.isRight() && response.value) {
                    fotos.value[key] = {
                        file: null,
                        url: response.value.image_url
                    }
                    fotosEnviadas.push({
                        id: response.value.id,
                        key: key as chavesFotosOpcionaisType,
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

        form.value.fotos_opcionais = fotosEnviadas;

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

    if (data.fotos_opcionais && data.fotos_opcionais.length > 0) {
        data.fotos_opcionais.forEach(photoInfo => {
            const key = photoInfo.key as chavesFotosOpcionaisType;
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

    <v-form-card :loading="isLoading" card-title="CADASTRO DE VEÍCULO"
        card-subtitle="Adicione fotos extras para valorizar seu anúncio" submit-text="Salvar e Finalizar"
        @submit.prevent="onSubmit">
        <v-card-subtitle class="page-subtitle text-center mb-6">passo 4 de 4</v-card-subtitle>
        <v-image-upload-gallery v-model:fotos="fotos" :objeto-fotos="FOTOS_OPCIONAIS" />
    </v-form-card>

    <SuccessDialog :is-modal-visible="isSuccessModalVisible"></SuccessDialog>
</template>

<style scoped></style>