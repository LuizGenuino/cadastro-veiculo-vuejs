import type { Axios, AxiosRequestConfig } from "axios";
import { getFromStorage, saveToStorage } from "./cache";

function makeCacheKey(url: string, params?: Record<string, any>): string {
    if (!params) {
        return `p84@${url}`;
    }
    return `p84@${url}?${JSON.stringify(params)}`
}

export async function fetchWithCache<R>(
    axios: Axios,
    url: string,
    params?: any,
    maxAgeMs = 30 * 60 * 1000,
    config?: AxiosRequestConfig
): Promise<R> {
    const cacheKey = makeCacheKey(url, params);
    const cached = getFromStorage<R>(cacheKey, maxAgeMs);
    if (cached) {
        return cached;
    }
    const response: any = await axios.get<R>(url, { params, ...config });
    saveToStorage(cacheKey, response.data);
    return response.data;

}