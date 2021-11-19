import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RecipeUserInputType {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;
}
