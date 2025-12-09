import type { VeiculosFipeType } from "@/services/http/cadastro-veiculo/types";


export const FOTOS_OBRIGATORIAS = {
    painel: { titulo: 'Painel', icon: 'mdi-speedometer', fileName: "Painel", class: "" },
    lateralEsquerda: { titulo: 'Lateral Esquerda', icon: 'mdi-motorbike', fileName: "Lateral esquerdo", class: "" },
    lateralDireita: { titulo: 'Lateral Direita', icon: 'mdi-motorbike', fileName: "Lateral direito", class: "mdi-flip-h" },
    documento: { titulo: 'Documento', icon: 'mdi-file-document', fileName: "Documento", class: "" }
} as const;

export const FOTOS_OPCIONAIS = {
    frente: { titulo: 'Frente', fileName: 'Frente', icon: 'mdi-motorbike' },
    tras: { titulo: 'Tras', fileName: 'Trás', icon: 'mdi-card-text' },
    pneuTraseiro: { titulo: 'Pneu Traseiro', fileName: 'Pneu traseiro', icon: 'mdi-tire' },
    pneuDianteiro: { titulo: 'Pneu Dianteiro', fileName: 'Pneu dianteiro', icon: 'mdi-tire' },
    motor: { titulo: 'Motor', fileName: 'Motor', icon: 'mdi-engine' }
} as const;

export const ROLE_PERMISSOES = ["Sudo", "Administrador"]

export type chavesFotosObrigatoriaType = keyof typeof FOTOS_OBRIGATORIAS;

export type chavesFotosOpcionaisType = keyof typeof FOTOS_OPCIONAIS;

export type FormCamposExtrasType = {
    config_id: number | null;
    valor: any | null;
}

export type ObjetoFotoType = {
    file: File | null;
    url: string;
}

export type InfoFotosType = {
    id: number;
    key: chavesFotosObrigatoriaType | chavesFotosOpcionaisType;
    descricao: string;
    image_url: string;
    is_primary: boolean;
    is_doc: boolean;
    thumbnails: boolean;
    display_order: number;
}

export type CadastroVeiculoType = {
    etapa_atual: string | null;
    id?: number;
    key_uid: string;
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
    observacao: string | null;
    campos_extras: Record<string, FormCamposExtrasType>;
    fotos_obrigatorias: InfoFotosType[];
    fotos_opcionais: InfoFotosType[];
    lista_veiculos_fipe?: VeiculosFipeType[]
    repasse?: boolean
}

export type CadastroRepasseType = {
    vehicleId: number;
    lance_minimo: number;
    inicia_em: string;
    termina_em: string | undefined;
    preco_compra: number | undefined;
    repasse_tipo: "COTACAO" | "REPASSE";
    observacao: string | null;
}



export interface FormStateType {
    valorDesejado: string;
    kmRodado: string;
    estadoConservacao: string;
    motivoVenda: string;
    observacao: string | null;
}

