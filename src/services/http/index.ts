import { clearCacheMemory } from "./cache";
import { HttpCadastroRepasse } from "./cadastro-repasse";
import { HttpCadastroVeiculo } from "./cadastro-veiculo";
import { HttpCamposExtras } from "./campos-extras";
import { HttpUploadImage } from "./uploads-images";
import { HttpUsuario } from "./usuario";

const API_PITOM84_URL = import.meta.env.VITE_PITOM84_API || ''
// const API_P84_URL = import.meta.env.VITE_P84_API || ''

export const httpService = {
    limparMemoriaCache: clearCacheMemory,
    usuario: new HttpUsuario(API_PITOM84_URL),
    camposExtras: new HttpCamposExtras(API_PITOM84_URL),
    veiculo: new HttpCadastroVeiculo(API_PITOM84_URL),
    midia: new HttpUploadImage(API_PITOM84_URL),
    repasse: new HttpCadastroRepasse(API_PITOM84_URL),
}