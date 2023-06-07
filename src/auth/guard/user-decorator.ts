import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // retrieve the user from the request object
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
