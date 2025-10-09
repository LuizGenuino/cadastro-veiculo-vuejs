import { HttpCadastroVeiculo } from "./cadastro-veiculo";
import { HttpUsuario } from "./usuario";

const API_PITOM84_URL = import.meta.env.VITE_P84_API || ''

export const httpService = {
    usuario: new HttpUsuario(API_PITOM84_URL),
    veiculo: new HttpCadastroVeiculo(API_PITOM84_URL)
}