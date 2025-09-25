import type { Right } from './right'

export class Left<T> {
  readonly error: T

  private constructor(error: T) {
    this.error = error
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
