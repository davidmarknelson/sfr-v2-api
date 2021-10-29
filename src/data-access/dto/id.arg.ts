import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class IdArg {
  @Field()
  id: number;
}
