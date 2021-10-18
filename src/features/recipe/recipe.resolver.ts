import { IdArgs, PaginationArgs } from '@api/data-access';
import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RecipeType } from './models';
import { RecipeService } from './recipe.service';

@Resolver(() => RecipeType)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [RecipeType])
  recipes(@Args() paginationArgs: PaginationArgs): Promise<RecipeType[]> {
    return this.recipeService.findAll(paginationArgs);
  }

  @Query(() => RecipeType)
  async recipe(@Args() idArgs: IdArgs): Promise<RecipeType> {
    const recipe = await this.recipeService.findOneById(idArgs);
    if (!recipe) {
      throw new NotFoundException();
    }
    return recipe;
  }
}
