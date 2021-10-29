import { IdArg, MessageType, PaginationArg } from '@api/data-access';
import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecipeInput, RecipesAndCountType, RecipeType } from '../dto';
import { RecipeService } from '../service';

@Resolver(() => RecipeType)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => RecipesAndCountType)
  async recipesAndCount(
    @Args() paginationArg: PaginationArg,
  ): Promise<RecipesAndCountType> {
    const recipesAndCount = await this.recipeService.findAllAndCount(
      paginationArg,
    );
    return { recipes: recipesAndCount[0], totalCount: recipesAndCount[1] };
  }

  @Query(() => RecipeType)
  async recipe(@Args() idArg: IdArg): Promise<RecipeType> {
    const recipe = await this.recipeService.findOneById(idArg);
    if (!recipe) {
      throw new NotFoundException();
    }
    return recipe;
  }

  @Mutation(() => RecipeType)
  createRecipe(@Args('recipe') recipe: RecipeInput): Promise<RecipeType> {
    return this.recipeService.create(recipe);
  }

  @Mutation(() => MessageType)
  async deleteRecipe(@Args() idArg: IdArg): Promise<MessageType> {
    const deleteResult = await this.recipeService.delete(idArg);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Recipe with id ${idArg.id} was not found`);
    }
    return { message: 'Recipe successfully deleted' };
  }
}
