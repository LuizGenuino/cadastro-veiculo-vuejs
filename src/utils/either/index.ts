import { Left } from './left'
import { Right } from './right'

export type Either<L, R> = Left<L> | Right<R>
