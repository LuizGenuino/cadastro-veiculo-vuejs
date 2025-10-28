import type { VeiculosFipeType } from "@/services/http/cadastro-veiculo/types";


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


export type CadastroVeiculoType = {
    etapa_atual: string | null;
    id?: number;
    short_id?: string;
    id_loja_usuario: number;
    nome_loja_usuario: string;
    placa_ou_chassi: string;
    nome_proprietario: string;
    telefone_proprietario: string;
    id_veiculo_fipe: string;
    codigo_fipe: string
    chassi: string
    placa: string;
    marca: string;
    modelo: string;
    ano_fabricacao: string;
    ano_modelo: string
    valor_fipe: string;
    valorDesejado: number;
    kmRodado: number;
    estadoConservacao: string;
    motivoVenda: string;
    campos_extras: Record<string, CamposExtrasValueType>;
    fotos_obrigatorias: Partial<Record<requiredPhotosKey, PhotoData>>;
    fotos_opcionais: Partial<Record<optionalPhotosKey, PhotoData>>;
    lista_veiculos_fipe?: VeiculosFipeType[]
}

export type CamposExtrasValueType = {
    id: number | null;
    type: string | null;
    valor: any | null;
}

export interface FormStateType {
    valorDesejado: string;
    kmRodado: string;
    estadoConservacao: string;
    motivoVenda: string;
}

export interface PhotoData {
    file: File;
    url: string;
}