import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TestingType {
  @Field()
  message: string;
}
