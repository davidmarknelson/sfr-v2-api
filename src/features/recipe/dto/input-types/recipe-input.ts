import { RecipePhotoInput } from '@api/features/recipe-photo/dto';
import { recipeConstants } from '@api/utilities/constants';
import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Difficulty } from '../enums';

@InputType()
export class RecipeInput {
  @MaxLength(recipeConstants.nameMaxLength, {
    message: `Name cannot be more than ${recipeConstants.nameMaxLength} characters long`,
  })
  @Field()
  name: string;

  @MaxLength(recipeConstants.descriptionMaxLength, {
    message: `Description cannot be more than ${recipeConstants.descriptionMaxLength} characters long`,
  })
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

  @Field(() => [RecipePhotoInput], { nullable: true })
  photos: RecipePhotoInput[] | null;
}
