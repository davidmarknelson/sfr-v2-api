import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecipeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
