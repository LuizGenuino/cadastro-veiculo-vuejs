import type { Left } from './left'

export class Right<T> {
  readonly value: T

  private constructor(value: T) {
    this.value = value
  }

  isLeft(): this is Left<T> {
    return false
  }

  isRight(): this is Right<T> {
    return true
  }

  static create<U>(value: U): Right<U> {
    return new Right<U>(value)
  }
}
