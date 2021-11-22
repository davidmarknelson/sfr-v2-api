import { RecipeType } from '@api/features/recipe/dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => [RecipeType])
  recipes?: RecipeType[];
}
