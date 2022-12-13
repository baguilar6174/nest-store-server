import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      throw new InternalServerErrorException(`User not found in request`);
    }
    return !data ? user : user[data];
  },
);
