import { IdArgs, PaginationArgs } from '@api/data-access';
import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecipeInput, RecipeType } from './models';
import { RecipesAndCountType } from './models/recipes-and-count';
import { RecipeService } from './recipe.service';

@Resolver(() => RecipeType)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => RecipesAndCountType)
  async recipesAndCount(
    @Args() paginationArgs: PaginationArgs,
  ): Promise<RecipesAndCountType> {
    const recipesAndCount = await this.recipeService.findAllAndCount(
      paginationArgs,
    );
    return { recipes: recipesAndCount[0], totalCount: recipesAndCount[1] };
  }

  @Query(() => RecipeType)
  async recipe(@Args() idArgs: IdArgs): Promise<RecipeType> {
    const recipe = await this.recipeService.findOneById(idArgs);
    if (!recipe) {
      throw new NotFoundException();
    }
    return recipe;
  }

  @Mutation(() => RecipeType)
  createRecipe(@Args('recipe') recipe: RecipeInput): Promise<RecipeType> {
    return this.recipeService.create(recipe);
  }
}
