import { toast } from "@/utils/swal/toast";
import type { AxiosError } from "axios";

export function handlerErrorRequest(error: AxiosError) {

    if (error.code === 'ECONNABORTED') {
        toast('Erro de conexão com o servidor. Tente novamente.', 'error');
        return;
    }
    if (error.response?.status === 400) {    
        toast((error as any).response?.data?.message || 'Erro na requisição. Tente novamente.', 'error');
        return;
    }
    if (error.response?.status === 401) {
        console.warn("Não autorizado! Redirecionando para a página de login.");
        toast('Sessão expirada. Faça login novamente.', 'error');
        setTimeout(() => {
            window.location.href = 'https://app.pitom.com.br/login'
        }, 3000)
        return;
    }
    if (error.response?.status === 404) {
        toast('Informação não encontrada. Tente novamente.', 'error');
        return;
    }
    if (error.response?.status === 500) {
        toast('Erro interno do servidor. Tente novamente em alguns minutos.', 'error');
        return;
    }
    if (error.response?.status === 501) {
        toast('Funcionalidade temporariamente indisponível.', 'error');
        return;
    }
    else {
        toast('Erro interno do servidor. Tente novamente em alguns minutos.', 'error');
        return;
    }
}