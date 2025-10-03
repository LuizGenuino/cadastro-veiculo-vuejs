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

export const FOTOS_OBRIGATORIAS = {
    painel: { titulo: 'Painel', icon: 'mdi-speedometer', class: "" },
    lateralEsquerda: { titulo: 'Lateral Esquerda', icon: 'mdi-motorbike', class: "" },
    lateralDireita: { titulo: 'Lateral Direita', icon: 'mdi-motorbike', class: "mdi-flip-h" },
    documento: { titulo: 'Documento', icon: 'mdi-file-document', class: "" }
} as const;

export const FOTOS_OPCIONAIS = {
    frente: { titulo: 'Frente', icon: 'mdi-motorbike' },
    tras: { titulo: 'Tras', icon: 'mdi-card-text' },
    pneuTraseiro: { titulo: 'Pneu Traseiro', icon: 'mdi-tire' },
    pneuDianteiro: { titulo: 'Pneu Dianteiro', icon: 'mdi-tire' },
    motor: { titulo: 'Motor', icon: 'mdi-engine' }
} as const;

export type requiredPhotosKey = keyof typeof FOTOS_OBRIGATORIAS;

export type optionalPhotosKey = keyof typeof FOTOS_OPCIONAIS;

type PerguntaKey = typeof PERGUNTAS[number]['key'];

export type CadastroVeiculoType = {
    etapa_atual: string | null;
    uid?: string;
    loja_usuario: string;
    placa_ou_chassi: string;
    nome_proprietario: string;
    telefone_proprietario: string;
    id_veiculo_fipe: string;
    chassi: string
    placa: string;
    marca: string;
    modelo: string;
    ano: string;
    valor_fipe: string;
    valorDesejado: number;
    kmRodado: number;
    estadoConservacao: string;
    motivoVenda: string;
    checklist: Partial<Record<PerguntaKey, boolean | null>>;
    fotos_obrigatorias: Partial<Record<requiredPhotosKey, PhotoData>>;
    fotos_opcionais: Partial<Record<optionalPhotosKey, PhotoData>>;

}

export interface VeiculoType {
    uid: string;
    placa: string;
    marca: string;
    modelo: string;
    ano: string;
    valor_fipe: string;
}

export interface FormStateType {
    valorDesejado: string;
    kmRodado: string;
    estadoConservacao: string;
    motivoVenda: string;
    checklist: Partial<Record<PerguntaKey, boolean | null>>;
}

export interface PhotoData {
    file: File;
    url: string;
}