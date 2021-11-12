import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class LoginArg {
  @Field()
  email: string;

  @Field()
  password: string;
}
