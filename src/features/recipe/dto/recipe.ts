import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RecipePhotoType } from '../../recipe-photo/dto';

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
}
