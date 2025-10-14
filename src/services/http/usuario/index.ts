import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { UsuarioResponseType } from "./types";
import { fetchWithCache } from "../http.cache";

export class HttpUsuario extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/user'

    async currentUser(): Promise<Either<null, UsuarioResponseType>> {
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