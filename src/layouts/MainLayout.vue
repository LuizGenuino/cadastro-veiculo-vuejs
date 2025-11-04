<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const theme = ref('light')
const { smAndUp } = useDisplay()

function onClick() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
    <v-responsive class="min-h-screen">
        <v-app :theme="theme">
            <div :class="`d-flex flex-row justify-space-between align-center pa-4 ${smAndUp ? 'bg-primary' : ''}`">
                <p :class="`text-h6 font-weight-bold  ${!smAndUp ? 'text-primary' : ''}`">P84</p>

                <v-btn color="bg-component" :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="onClick"></v-btn>
            </div>

            <v-main id="main-component">
                <v-container class="d-flex flex-column align-center justify-center h-100">
                    <router-view></router-view>
                </v-container>
            </v-main>
        </v-app>
    </v-responsive>
</template>