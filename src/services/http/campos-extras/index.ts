import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { CamposExtrasResponseType } from "./types";

export class HttpCamposExtras extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/vehicles/extra-fields'

    async list(): Promise<Either<null, CamposExtrasResponseType>> {
        try {
            const response = await this.http.get(`${this.resource}`)
            return Right.create(response.data)
        } catch {
            return Left.create(null)
        }
    }
}