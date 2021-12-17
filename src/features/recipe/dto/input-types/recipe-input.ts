import { RecipePhotoInput } from '@api/features/recipe-photo/dto';
import {
  apiRecipeConstants,
  apiRecipeMessageConstants,
} from '@api/utilities/constants';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, MaxLength } from 'class-validator';

@InputType()
export class RecipeInput {
  @MaxLength(apiRecipeConstants.nameMaxLength, {
    message: apiRecipeMessageConstants.nameMaxLengthError,
  })
  @Field()
  name: string;

  @MaxLength(apiRecipeConstants.descriptionMaxLength, {
    message: apiRecipeMessageConstants.descriptionMaxLengthError,
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

  @IsIn([1, 2, 3, 4, 5], { message: 'Difficulty must be between 1 - 5' })
  @Field(() => Int)
  difficulty: number;

  @Field(() => [RecipePhotoInput], { nullable: true })
  photos: RecipePhotoInput[] | null;
}
