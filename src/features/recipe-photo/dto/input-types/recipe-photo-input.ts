import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RecipePhotoInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  path: string;

  @Field()
  cloudinaryPublicId: string;
}
