import axios from "axios";
import { useRoute } from "vue-router"

class AxiosInstance {
    public initialize(url: string) {
        const axiosInstance = axios.create({
            baseURL: url
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
            async (error) => {

                //  const message = error.response?.data?.message || 'Ocorreu um erro inesperado'
                //  toast(message, 'error')

                return Promise.reject(error)
            }
        )

        return axiosInstance
    }

    private getToken(): string | null {
        const route = useRoute()
        const params: any = route.params
        if (params && params?.token) {
            return params?.token
        }
        return null
    }
}

export const axiosInstance = new AxiosInstance()