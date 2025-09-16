/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import './assets/main.css'

// Plugins
import { registerPlugins } from '@/plugins'
// import VFormCard from './components/VFormCard/VFormCard.vue'
// import VIdVehicleInput from './components/VInputs/VIdVehicleInput/VIdVehicleInput.vue'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

// app.component('VFormCard', VFormCard)
// app.component('VIdVehicleInput', VIdVehicleInput)

app.mount('#app')
