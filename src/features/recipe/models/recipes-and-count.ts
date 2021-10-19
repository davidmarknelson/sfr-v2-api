import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RecipeType } from './recipe';

@ObjectType()
export class RecipesAndCountType {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [RecipeType])
  recipes: RecipeType[];
}
