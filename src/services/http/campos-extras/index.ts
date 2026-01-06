import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import { fetchWithCache } from "../http.cache";
import type { FormDadosExtrasType, ResponseCamposExtrasType, ResponseDadosExtrasType } from "./types";

export class HttpCamposExtras extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/vehicles/extra-fields'

    async listar(): Promise<Either<null, ResponseCamposExtrasType>> {
        try {
            const response = await fetchWithCache<any>(
                this.http,
                this.resource,
            );
            return Right.create(response)
        } catch {
            return Left.create(null)
        }
    }

     async cadastrarDadosExtras(form: FormDadosExtrasType): Promise<Either<null, ResponseDadosExtrasType>> {
            try {
                const response = await this.http.post(`${this.resource}/upsert-data`, form)
                return Right.create(response.data.data)
            } catch {
                return Left.create(null)
            }
        }
}