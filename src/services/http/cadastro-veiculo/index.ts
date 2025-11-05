import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { AdditionalInformationDataType, AdditionalInformationFormType, VehicleFipeSelectionFormType, VehicleRegistrationFormType, VeiculoDataType } from "./types";

export class HttpCadastroVeiculo extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/vehicles'

    async create(form: VehicleRegistrationFormType): Promise<Either<null, VeiculoDataType>> {
        try {
            const response = await this.http.post(`${this.resource}/register`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }

    async selectVehicle(form: VehicleFipeSelectionFormType): Promise<Either<null, VeiculoDataType>> {
        try {
            const response = await this.http.patch(`${this.resource}/update-fipe`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }

    async insertAdditionalInformation(form: AdditionalInformationFormType): Promise<Either<null, AdditionalInformationDataType>> {
        try {
            const response = await this.http.post(`${this.resource}/extra-fields/insert-data`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }
}