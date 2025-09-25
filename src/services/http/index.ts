import { HttpCadastroVeiculo } from "./cadastro-veiculo";

const API_URL = "teste"

export const httpService = {
    veiculo: new HttpCadastroVeiculo(API_URL)
}