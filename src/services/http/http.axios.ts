import router from "@/router";
import axios, { AxiosError } from "axios";
import { handlerErrorRequest } from "../middlewares/errorHandler";

class AxiosInstance {
    public initialize(url: string) {
        const axiosInstance = axios.create({
            baseURL: url,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000, //
        })

        axiosInstance.interceptors.request.use(async (config) => {
            const userToken = this.getToken()
            if (!userToken) {
                return config
            }
            config.headers['Authorization'] = `Bearer ${userToken}`
            return config
        })

        axiosInstance.interceptors.response.use(
            async (response) => {
                return Promise.resolve(response)
            },
            async (error: AxiosError) => {

                handlerErrorRequest(error)
                return Promise.reject(error)
            }
        )

        return axiosInstance
    }

    private getToken(): string | null {
        const params = router.currentRoute.value.params as { token?: string }
        if (params && params?.token) {
            return params?.token
        }
        return null
    }
}

export const axiosInstance = new AxiosInstance()