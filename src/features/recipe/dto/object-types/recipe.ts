import { RecipePhotoType } from '@api/features/recipe-photo/dto';
import { RecipeUserType } from '@api/features/user/dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Int)
  cookTime: number;

  @Field(() => Int)
  difficulty: number;

  @Field(() => [RecipePhotoType])
  photos: RecipePhotoType[];

  @Field(() => RecipeUserType)
  creator: RecipeUserType;
}
