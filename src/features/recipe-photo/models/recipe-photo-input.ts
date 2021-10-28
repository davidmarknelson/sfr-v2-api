import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecipePhotoInput {
  @Field()
  path: string;
}
