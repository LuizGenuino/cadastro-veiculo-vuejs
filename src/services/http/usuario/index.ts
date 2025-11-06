import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import { fetchWithCache } from "../http.cache";
import type { ResponseUsuarioType } from "./types";

export class HttpUsuario extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/user'

    async usuarioAtual(): Promise<Either<null, ResponseUsuarioType>> {
        try {
            const response = await this.http.get(`${this.resource} `)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }
}