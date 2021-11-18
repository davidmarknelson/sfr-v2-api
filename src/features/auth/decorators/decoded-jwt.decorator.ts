import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const DecodedJwt = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    ctx.getContext().req.decodedJwt = ctx.getContext().req.user;
    return ctx.getContext().req.decodedJwt;
  },
);
