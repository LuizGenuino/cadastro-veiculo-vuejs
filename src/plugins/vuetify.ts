/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#71b790',
                    secondary: '#384967',
                    background: '#ffffffff',
                    "bg-component": '#ECEFF1',
                    span: '#828282'
                },
            },
            dark: {
                colors: {
                    primary: '#71b790',
                    secondary: '#384967',
                    background: '#29364d',
                    "bg-component": '#1e2738ff',
                    span: '#b6bac2',
                    surface: '#1e2738ff',
                },
            },
        },
    },
})
