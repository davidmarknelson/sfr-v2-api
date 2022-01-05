import { Field, InputType, Int } from '@nestjs/graphql';
import { RecipeInput } from './recipe-input';

@InputType()
export class RecipeEditInput extends RecipeInput {
  @Field(() => Int)
  id: number;
}
