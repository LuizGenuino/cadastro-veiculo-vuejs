export type UsuarioDataType = {
    user_name: string,
    isFinance: boolean,
    phone: string,
    email: string,
    user_stores: UserStoresType[],
    user_groups: any[],
    user_teams: any[],
    profile: string,
    user_id: number,
    user_UID: string,
    user_store_id: string[],
    permissions: UserPermissionsType[]
}

export type UserStoresType = {
    id: number,
    name: string,
}

export type UserPermissionsType = {
    actions: string,
    conditions: string,
    subject: string,
}





