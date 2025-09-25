import type { Axios } from "axios";
import { axiosInstance } from "./http.axios";

export abstract class HttpBase {
    protected readonly http: Axios

    constructor(url: string){
        this.http = axiosInstance.initialize(url)
    }
}