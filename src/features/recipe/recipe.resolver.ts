import { NotFoundException } from '@nestjs/common';
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
  async recipe(@Args('id', { type: () => Int }) id: number): Promise<Recipe> {
    const recipe = await this.recipeService.findOneById(id);
    if (!recipe) {
      throw new NotFoundException();
    }
    return this.recipeService.findOneById(id);
  }
}
