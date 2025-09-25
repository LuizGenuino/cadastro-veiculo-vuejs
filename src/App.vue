<script lang="ts" setup>
import VLoading from './components/VLoading/VLoading.vue'

</script>


<template>
    <v-app>
        <v-main class="app-background">
            <v-container fluid class="pa-0">
                <router-view />
            </v-container>
        </v-main>
    </v-app>
    <v-loading />
</template>
