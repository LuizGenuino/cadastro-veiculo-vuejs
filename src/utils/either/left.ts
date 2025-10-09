import type { Right } from './right'

export class Left<T> {
    readonly value: T

    private constructor(value: T) {
        this.value = value
    }

    isLeft(): this is Left<T> {
        return true
    }

    isRight(): this is Right<T> {
        return false
    }

    static create<U>(error: U): Left<U> {
        return new Left<U>(error)
    }
}
