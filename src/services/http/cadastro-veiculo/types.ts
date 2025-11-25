import type { FormCamposExtrasType } from "@/stores/types"

export type FormRegistroVeiculoType = {
    customer_name: string,
    customer_phone: string,
    store_id: number,
    vehicle: string,
    type_vehicle: string,
}

export type FormSelecaoVeiculoFipeType = {
    id: number,
    year_model: number,
    year_manufacture: number,
    fipe_code: string,
    fipe_value: number
}

export type FormInformacoesAdicionaisType = {
    vehicle_id: number,
    desired_value: number,
    mileage: number,
    conservation_state: string,
    sale_reason: string,
    observation: string | null
    extra_fields: Record<string, FormCamposExtrasType>
}

export type ResponseVeiculoType = {
    id: number,
    key_uid: string,
    customer_name: string,
    customer_phone: string,
    plate: string,
    chassis: string,
    short_id: string,
    vehicle_origin: string,
    year_model: string,
    year_manufacture: string,
    vehicle_year_display: string,
    fipe_code: string,
    fipe_value: number,
    vehicle_brand: string,
    vehicle_model: string,
    fuel_type: string,
    integration_provider: string,
    integration_query_id: string,
    latitude: number,
    longitude: number,
    store_id: number,
    store_name: string,
    user_id: number,
    user_name: string,
    user_email: string
    images_complete: boolean,
    is_active: boolean,
    desired_value: number,
    mileage: number,
    conservation_state: string,
    registration_notes: string,
    sale_reason: string,
    fipes: VeiculosFipeType[] | null,
    created_at: string,
    updated_at: string,
}

export type VeiculosFipeType = {
    id: string,
    tipo: string,
    fipe_codigo: string,
    marca: string,
    modelo: string,
    ano: string,
    name: string,
    combustivel: string,
    preco: string,
    ano_modelo: string,
    updated_at: string
}


export type ResponseInformacoesAdicionaisType = {
    vehicle_id: number,
    desired_value: number,
    mileage: number,
    conservation_state: string,
    sale_reason: string,
    observation: string | null,
    extra_fields: ResponseDadosExtrasType[]
}


export type ResponseDadosExtrasType = {
    id: number,
    vehicle_id: number,
    config_id: number,
    text_value: string,
    numeric_value: number,
    boolean_value: true,
    date_value: string,
    time_value: string,
    json_value: any,
    created_at: string,
    updated_at: string,
    updated_by: number
}