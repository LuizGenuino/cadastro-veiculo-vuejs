import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";

export class HttpCadastroVeiculo extends HttpBase {
    protected resource = '/cadastro'

    async create(formData: FormData): Promise<Either<null, any>> {
        try {
            const response = await this.http.post(`${this.resource}`, formData)
            return Right.create(response.data)
        } catch {
            return Left.create(null)
        }
    }


}