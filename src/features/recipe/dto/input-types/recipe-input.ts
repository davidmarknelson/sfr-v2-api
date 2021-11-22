import { RecipePhotoInput } from '@api/features/recipe-photo/dto';
import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Difficulty } from '../enums';

@InputType()
export class RecipeInput {
  @MaxLength(256, { message: 'Name cannot be more than 256 characters long' })
  @Field()
  name: string;

  @MaxLength(512, {
    message: 'Description cannot be more than 512 characters long',
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
