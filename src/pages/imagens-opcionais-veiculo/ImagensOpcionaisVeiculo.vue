<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SuccessDialog from './components/SuccessDialog.vue';
import { useLoading } from '@/stores/loading';
import { toast } from '@/utils/swal/toast';
import { FOTOS_OPCIONAIS, type CadastroVeiculoType, type chavesFotosOpcionaisType, type InfoFotosType, type ObjetoFotoType } from '@/stores/types';
import { useVeiculo } from '@/stores/veiculo';
import { httpService } from '@/services/http';
import { useUsuario } from '@/stores/usuario';

const router = useRouter()
const form = ref<Partial<CadastroVeiculoType>>({});

const fotos = ref<Partial<Record<chavesFotosOpcionaisType, ObjetoFotoType>>>({});


const isSuccessModalVisible = ref(false)

const isLoading = ref(false);

async function nextPage() {
    form.value.publicado = true
    const veiculoStore = useVeiculo();
    if (form.value.repasse === true || String(form.value.repasse) === "true") {
        form.value.etapa_atual = 'cadastro-repasse'
        await veiculoStore.set(form.value as CadastroVeiculoType);
        router.push({ path: `/cadastro-repasse/${veiculoStore.getToken()}` })
        return
    }

    await veiculoStore.set(form.value as CadastroVeiculoType)
    toast('Cadastro sem fotos enviado com sucesso!', 'success');
    isSuccessModalVisible.value = true
}

function validaImagem(arrayFotos: Array<[chavesFotosOpcionaisType, ObjetoFotoType | undefined]>): "valid" | "alreadyUploaded" | "invalid" {

    if (arrayFotos.length === 0) {
        return "alreadyUploaded";
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

const onSubmit = async () => {
    try {
        useLoading().show("Enviando Fotos Opcionais...")
        isLoading.value = true;

        const arrayFotos = Object.entries(fotos.value) as Array<[chavesFotosOpcionaisType, ObjetoFotoType | undefined]>;

        const validacao = validaImagem(arrayFotos);

        if (validacao === "invalid") return;

        if (validacao === "alreadyUploaded") {
            nextPage();
            return;
        }

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
            formData.append('arquivo', photo.file, `${FOTOS_OPCIONAIS[key].fileName}.webp`);

            try {
                const response = await httpService.midia.salvarImagem(formData);

                if (response.isRight() && response.value) {
                    fotos.value[key] = {
                        file: null,
                        url: response.value.image_url
                    };
                    return {
                        id: response.value.id,
                        key: key as chavesFotosOpcionaisType,
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
                toast(`Erro ao enviar foto do(a) ${FOTOS_OPCIONAIS[key].titulo}.`, 'error');
                return null;
            }
        });

        const results = await Promise.allSettled(promises);

        const fotosEnviadas = results
            .filter(r => r.status === "fulfilled" && r.value)
            .map(r => (r as PromiseFulfilledResult<InfoFotosType>).value);

        form.value.fotos_opcionais = fotosEnviadas;

        if (fotosEnviadas.length < arrayFotos.length) {
            return;
        }

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

     if (data.publicado === true || String(data.publicado).toLowerCase() === 'true') {
        isSuccessModalVisible.value = true
    }

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

    <SuccessDialog :is-modal-visible="isSuccessModalVisible" :form="form"></SuccessDialog>
</template>

<style scoped></style>
