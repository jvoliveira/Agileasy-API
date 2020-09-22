export abstract class BaseModel<T> {
  id!: number
  dados!: any
  ativo!: boolean

  constructor(id: number, ativo = true) {
    this.id = id
    this.ativo = ativo
  }

  abstract fillFromJson(json: any, recursive?: string[]): T

  abstract copy(): T
}
