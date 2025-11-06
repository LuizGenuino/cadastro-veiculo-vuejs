import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { FormInformacoesAdicionaisType, FormRegistroVeiculoType, FormSelecaoVeiculoFipeType, ResponseInformacoesAdicionaisType, ResponseVeiculoType } from "./types";

export class HttpCadastroVeiculo extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/vehicles'

    async cadastrar(form: FormRegistroVeiculoType): Promise<Either<null, ResponseVeiculoType>> {
        try {
            const response = await this.http.post(`${this.resource}/register`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }

    async selecionarFipe(form: FormSelecaoVeiculoFipeType): Promise<Either<null, ResponseVeiculoType>> {
        try {
            const response = await this.http.patch(`${this.resource}/update-fipe`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }

    async cadastrarDadosExtras(form: FormInformacoesAdicionaisType): Promise<Either<null, ResponseInformacoesAdicionaisType>> {
        try {
            const response = await this.http.post(`${this.resource}/extra-fields/insert-data`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }
}