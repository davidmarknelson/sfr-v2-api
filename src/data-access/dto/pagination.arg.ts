import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArg {
  @Field()
  skip: number;

  @Field()
  take: number;
}
