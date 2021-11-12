import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class EmailArg {
  @Field()
  email: string;
}
