import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { FormRegistroRepasseType, ResponseRepasseType } from "./types";

export class HttpCadastroRepasse extends HttpBase {
    constructor(url: string) {
        super(url)
    }

    protected resource = '/p84/vehicles'

    async cadastrar(form: FormRegistroRepasseType): Promise<Either<null, ResponseRepasseType>> {
        try {
            const response = await this.http.post(`${this.resource}/post-repasse`, form)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }
}