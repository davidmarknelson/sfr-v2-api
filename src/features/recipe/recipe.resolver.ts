import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Recipe } from './recipe.entity';
import { RecipeService } from './recipe.service';

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [Recipe])
  recipes(): Promise<Recipe[]> {
    return this.recipeService.findAll();
  }

  @Query(() => Recipe)
  user(@Args('id', { type: () => Int }) id: number): Promise<Recipe> {
    return this.recipeService.findOneById(id);
  }
}
