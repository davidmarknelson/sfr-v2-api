import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecipePhotoType {
  @Field(() => Int)
  id: number;

  @Field()
  path: string;
}
