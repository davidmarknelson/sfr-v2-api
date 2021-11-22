import { RecipePhotoType } from '@api/features/recipe-photo/dto';
import { RecipeUserType } from '@api/features/user/dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Difficulty } from '../enums';

@ObjectType()
export class RecipeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  ingredients: string[];

  @Field(() => [String])
  instructions: string[];

  @Field(() => Int, {
    description: 'Number of minutes it takes to cook the meal',
  })
  cookTime: number;

  @Field(() => Difficulty)
  difficulty: Difficulty;

  @Field(() => [RecipePhotoType])
  photos: RecipePhotoType[];

  @Field(() => RecipeUserType)
  creator: RecipeUserType;
}
