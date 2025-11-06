import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import { fetchWithCache } from "../http.cache";
import type { ResponseCamposExtrasType } from "./types";

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
}