export type SnackbarType = (message: string, color: 'success' | 'error' | 'info' | 'warning') => void;

export type CadastroVeiculoType = {
    uid?: string | null;
    loja_usuario: string;
    placa_ou_chassi: string;
    nome_proprietario: string;
    telefone_proprietario: string;
    id_veiculo_fipe: string;
    placa: string;
    marca: string;
    modelo: string;
    ano: string;
    valor_fipe: string;
    valorDesejado?: number;
    kmRodado?: number;
    estadoConservacao?: string;
    motivoVenda?: string;
}

export interface VeiculoType {
    uid: string;
    placa: string;
    marca: string;
    modelo: string;
    ano: string;
    valor_fipe: string;
}

export const PERGUNTAS = [
    { key: 'ipva', texto: 'IPVA está em dia?' },
    { key: 'chaveReserva', texto: 'Possui chave reserva?' },
    { key: 'pneusOriginais', texto: 'Pneus são originais?' },
    { key: 'manual', texto: 'Possui manual do proprietário?' },
    { key: 'revisoes', texto: 'Revisões em dia?' },
    { key: 'seguro', texto: 'Possui seguro?' },
    { key: 'multas', texto: 'Possui multas pendentes?' },
    { key: 'financiamento', texto: 'Possui financiamento?' },
    { key: 'sinistro', texto: 'Já teve sinistro?' },
    { key: 'modificacoes', texto: 'Possui modificações?' },
    { key: 'garantia', texto: 'Ainda está na garantia?' },
    { key: 'unicoDono', texto: 'Você é o único dono?' }
] as const;

type PerguntaKey = typeof PERGUNTAS[number]['key'];


export interface FormStateType {
    valorDesejado: number | null;
    kmRodado: number | null;
    estadoConservacao: string;
    motivoVenda: string;
    checklist: Partial<Record<PerguntaKey, 'sim' | 'nao' | null>>;
}