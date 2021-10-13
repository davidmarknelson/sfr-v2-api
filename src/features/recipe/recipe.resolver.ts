import { NotFoundException } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { RecipeType } from './models';
import { RecipeService } from './recipe.service';

@Resolver(() => RecipeType)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [RecipeType])
  recipes(): Promise<RecipeType[]> {
    return this.recipeService.findAll();
  }

  @Query(() => RecipeType)
  async recipe(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RecipeType> {
    const recipe = await this.recipeService.findOneById(id);
    if (!recipe) {
      throw new NotFoundException();
    }
    return this.recipeService.findOneById(id);
  }
}
