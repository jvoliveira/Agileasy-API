import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestAuth } from '../interfaces/request-auth.interface'

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestAuth
    return request.user
  },
)
