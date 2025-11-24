<script setup lang="ts">
import { httpService } from '@/services/http';
import { useLoading } from '@/stores/loading';
import { useVeiculo } from '@/stores/veiculo';
import { toast } from '@/utils/swal/toast';
import { FOTOS_OBRIGATORIAS, type CadastroVeiculoType, type chavesFotosObrigatoriaType, type InfoFotosType, type ObjetoFotoType, } from '@/stores/types';
import { ref, computed, watch, defineModel } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter();

const form = ref<Partial<CadastroVeiculoType>>({});

const fotos = ref<Partial<Record<chavesFotosObrigatoriaType, ObjetoFotoType>>>({});

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


async function nextPage() {
    toast('Imagens cadastradas com sucesso!', 'success');
    await useVeiculo().set(form.value as CadastroVeiculoType);
    const { token } = router.currentRoute.value.params as { token?: string };
    if (token) {
        router.push({ path: `/imagens-opcionais/${token}` });
    }
}

function validaImagem(arrayFotos: Array<[chavesFotosObrigatoriaType, ObjetoFotoType | undefined]>): "valid" | "alreadyUploaded" | "invalid" {

    if (!todasFotosEnviadas.value) {
        toast('Por favor, adicione todas as fotos obrigatórias.', 'warning');
        return "invalid";
    }

    const todasComUrl = arrayFotos.every(([_, photo]) => !photo?.file && photo?.url);
    if (todasComUrl) {
        return "alreadyUploaded";
    }

    const faltandoFoto = arrayFotos.some(([_, photo]) => !photo?.file && !photo?.url);
    if (faltandoFoto) {
        toast('Falha no upload - tente novamente.', 'error');
        return "invalid";
    }

    return "valid";
}

async function onSubmit() {
    try {
        const arrayFotos = Object.entries(fotos.value) as Array<[chavesFotosObrigatoriaType, ObjetoFotoType | undefined]>;
        const validacao = validaImagem(arrayFotos);

        if (validacao === "invalid") return;

        if (validacao === "alreadyUploaded") {
            nextPage();
            return;
        }

        useLoading().show("Enviando Fotos Obrigatórias...");
        isLoading.value = true;

        let ordem = 0;

        const promises = arrayFotos.map(async ([key, photo]) => {
            if (!photo?.file) return null;

            ordem++;
            const isDocs = key.includes('documento');
            const formData = new FormData();
            formData.append('ordem', ordem.toString());
            formData.append('is_doc', isDocs.toString());
            formData.append('thumbnails', (!isDocs).toString());
            formData.append('vehicle_id', form.value.id?.toString() || '');
            formData.append('arquivo', photo.file);

            try {
                const response = await httpService.midia.salvarImagem(formData);

                if (response.isRight() && response.value) {
                    fotos.value[key] = {
                        file: null,
                        url: response.value.image_url
                    };
                    return {
                        id: response.value.id,
                        key: key as chavesFotosObrigatoriaType,
                        descricao: response.value.descricao,
                        image_url: response.value.image_url,
                        is_primary: response.value.is_primary,
                        is_doc: response.value.is_doc,
                        thumbnails: response.value.thumbnails,
                        display_order: response.value.display_order,
                    };
                } else {
                    fotos.value[key] = undefined;
                    throw new Error("Falha ao enviar imagem");
                }
            } catch (err) {
                console.error(`Erro ao enviar foto do(a) ${key}:`, err);
                toast(`Erro ao enviar foto do(a) ${FOTOS_OBRIGATORIAS[key].titulo}.`, 'error');
                return null;
            }
        });

        const results = await Promise.allSettled(promises);

        const fotosEnviadas = results
            .filter(r => r.status === "fulfilled" && r.value)
            .map(r => (r as PromiseFulfilledResult<InfoFotosType>).value);

        form.value.fotos_obrigatorias = fotosEnviadas;

        if (fotosEnviadas.length < arrayFotos.length) {
            return;
        }

        form.value.etapa_atual = 'imagens-opcionais';

        await nextPage();

    } catch (error) {
        console.error('Erro geral no envio:', error);
        toast('Não foi possível enviar as imagens. Tente novamente.', 'error');
    } finally {
        useLoading().hidden();
        isLoading.value = false;
    }
}


onMounted(() => {
    const data: Partial<CadastroVeiculoType> = useVeiculo().get();
    form.value = { ...data };

    if (data.fotos_obrigatorias && data.fotos_obrigatorias.length > 0) {
        data.fotos_obrigatorias.forEach(photoInfo => {
            const key = photoInfo.key as chavesFotosObrigatoriaType;
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
