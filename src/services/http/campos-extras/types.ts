export type ResponseCamposExtrasType = {
    isArray: boolean,
    length: number,
    path: string,
    duration: string,
    method: string,
    data: CamposExtrasType[],
    control: ControlType
}

type ControlType = {
    metadata: MetadataType
}

export type MetadataType = {
    total: number,
    groups: string[],
}

export type CamposExtrasType = {
    id: number,
    data_type: string,
    field_description: string,
    field_key: string,
    field_label: string,
    is_multiple: boolean,
    is_required: boolean,
    select_options: string[] | null,
    display: DisplayType,
    validation: ValidationType,
}

export type DisplayType = {
    group: string,
    help_text: string | null,
    order: number,
    placeholder: string | null
}

export type ValidationType = {
    max_length: number | null
    max_value: number | null
    min_length: number | null
    min_value: number | null
    pattern: string | null
}








