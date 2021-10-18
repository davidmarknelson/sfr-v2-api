import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field()
  skip: number;

  @Field()
  take: number;
}
