import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecipeUserType {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;
}
