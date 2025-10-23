import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { VehicleRegistrationFormType, VeiculoResponseType } from "./types";

export class HttpCadastroVeiculo extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/vehicles/register'

    async create(form: VehicleRegistrationFormType): Promise<Either<null, VeiculoResponseType>> {
        try {
            const response = await this.http.post(`${this.resource}`, form)
            return Right.create(response.data)
        } catch {
            return Left.create(null)
        }
    }


}