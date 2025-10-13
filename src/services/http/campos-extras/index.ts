import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { CamposExtrasResponseType } from "./types";
import { fetchWithCache } from "../http.cache";

export class HttpCamposExtras extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/vehicles/extra-fields'

    async list(): Promise<Either<null, CamposExtrasResponseType>> {
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