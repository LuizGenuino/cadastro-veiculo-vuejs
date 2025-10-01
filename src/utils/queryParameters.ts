import type { LocationQuery } from "vue-router";
import type { CadastroVeiculoType } from "./types";

export function transformDataToQueryParameters(data: Partial<CadastroVeiculoType>): Record<string, string> {
    const queryParams: Record<string, string> = {};
    for (const key in data) {
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
                queryParams[key] = JSON.stringify(value);
            } else {
                queryParams[key] = String(value);
            }
        }
    }

    return queryParams;
}

export function parseQueryParametersToData(query: LocationQuery): Partial<CadastroVeiculoType> {
    const data: Partial<CadastroVeiculoType> = {};
    for (const key in query) {
        const value = query[key];
        if (value !== undefined) {
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                try {
                    (data as any)[key] = JSON.parse(value);
                } catch {
                    (data as any)[key] = value;
                }
            } else if (Array.isArray(value)) {
                (data as any)[key] = value[0];
            } else {
                (data as any)[key] = value;
            }
        }
    }
    return data;
}
