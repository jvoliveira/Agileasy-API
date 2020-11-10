import { IsArray } from 'class-validator'
export class AddCategoriaDto {
  @IsArray()
  categorias: number[]
}
