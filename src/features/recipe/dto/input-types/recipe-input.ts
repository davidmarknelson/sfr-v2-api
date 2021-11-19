import { RecipePhotoInput } from '@api/features/recipe-photo/dto';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RecipeInput {
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

  @Field(() => [RecipePhotoInput], { nullable: true })
  photos: RecipePhotoInput[] | null;
}
