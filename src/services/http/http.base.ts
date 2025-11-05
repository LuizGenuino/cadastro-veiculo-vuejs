import type { Axios } from "axios";
import { axiosInstance } from "./http.axios";

export abstract class HttpBase {
    protected readonly http: Axios

    constructor(url: string, isFormData: boolean = false) {
        this.http = axiosInstance.initialize(url, isFormData);
    }
}