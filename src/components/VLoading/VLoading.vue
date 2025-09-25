<script setup lang="ts">
import { useLoading } from '@/stores/loading';

const loading = useLoading()

</script>
<template>
    <v-dialog v-model="loading.state.dialog" persistent max-width="320">
        <v-card class="rounded-xl">
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" align="center">
                        <span class="text-h6 font-weight-bold">{{ loading.state.title }}</span>
                    </v-col>
                    <v-col cols="12" align="center" class="my-4">
                        <v-progress-circular indeterminate size="50" color="primary" />
                    </v-col>
                    <v-col cols="12" align="center">
                        <span class="text-subtitle-1 font-weight-regular" >{{ loading.state.message }}</span>
                    </v-col>

                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>