import { IsUrl } from 'class-validator'

export class AddDocumentoDto {
  @IsUrl()
  documentoUrl: string
}
