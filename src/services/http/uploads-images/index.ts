import { Right } from "@/utils/either/right";
import { HttpBase } from "../http.base";
import { Left } from "@/utils/either/left";
import type { Either } from "@/utils/either";
import type { ResponseImagensVeiculoType } from "./types";

export class HttpUploadImage extends HttpBase {
    constructor(url: string) {
        super(url, true) // Indica que usará FormData
    }

    protected resource = '/p84/upload'

    async salvarImagem(image: FormData): Promise<Either<null, ResponseImagensVeiculoType>> {
        try {
            const response = await this.http.post(`${this.resource}`, image)
            return Right.create(response.data.data)
        } catch {
            return Left.create(null)
        }
    }

}