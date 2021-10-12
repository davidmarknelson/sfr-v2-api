import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RecipePhotoType } from '../recipe-photo/recipe-photo';

@ObjectType()
export class RecipeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => RecipePhotoType)
  photo: RecipePhotoType;
}
