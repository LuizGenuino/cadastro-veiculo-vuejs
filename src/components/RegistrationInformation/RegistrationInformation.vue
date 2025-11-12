<script setup lang="ts">
import type { CadastroVeiculoType } from '@/stores/types';
import { defineProps } from 'vue'


const props = defineProps<{
    form?: Partial<CadastroVeiculoType>
}>()

</script>

<template>
    <div v-if="form?.id">
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-title class="text-h6 font-weight-bold">
                    Informações do Cadastro
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-row>
                         <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.nome_loja_usuario">
                            <p><b>Loja:</b> {{  form.nome_loja_usuario }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.nome_proprietario">
                            <p><b>Cliente:</b> {{ form.nome_proprietario }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.telefone_proprietario">
                            <p><b>Telefone do Cliente:</b> {{ form.telefone_proprietario }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.marca">
                            <p><b>Marca do Veiculo:</b> {{ form.marca }}</p>
                        </v-col>
                          <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.placa">
                            <p><b>placa:</b> {{ form.placa }}</p>
                        </v-col>
                          <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.chassi">
                            <p><b>Chassi:</b> {{ form.chassi }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4" class="d-flex" v-if="!form.placa && !form.chassi && form.placa_ou_chassi">
                            <p><b>placa ou Chassi:</b> {{ form.placa_ou_chassi }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.modelo">
                            <p><b>Modelo:</b> {{ form.modelo }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4" class="d-flex" v-if="form.valor_fipe">
                            <p><b>Valor FIPE:</b> {{ form.valor_fipe }}</p>
                        </v-col>
                        <v-col cols="12" md="6" lg="4"  class="d-flex" v-if="form.ano_fabricacao && form.ano_modelo">
                            <p><b>Ano:</b> {{ form.ano_fabricacao }}/{{ form.ano_modelo }}</p>
                        </v-col>
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>