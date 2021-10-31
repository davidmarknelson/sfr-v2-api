import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class NameArg {
  @Field()
  name: string;
}
