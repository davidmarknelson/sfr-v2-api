import {
  IdArg,
  MessageType,
  NameArg,
  PaginationArg,
} from '@api/data-access/dto';
import { DecodedJwt } from '@api/features/auth/decorators';
import { AccessTokenPayloadType } from '@api/features/auth/dto';
import { JwtAuthGuard } from '@api/features/auth/guards';
import { NameReplaceDashPipe } from '@api/utilities/pipe';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecipeInput, RecipesAndCountType, RecipeType } from '../dto';
import { RecipeCreatorGuard } from '../guards/recipe-creator.guard';
import { RecipeService } from '../service';

@Resolver()
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
  async recipe(
    @Args(NameReplaceDashPipe) nameArg: NameArg,
  ): Promise<RecipeType> {
    const recipe = await this.recipeService.findOneByName(nameArg);
    if (!recipe) {
      throw new NotFoundException();
    }
    return recipe;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => RecipeType)
  createRecipe(
    @Args('recipe') recipe: RecipeInput,
    @DecodedJwt() decodedJwt: AccessTokenPayloadType,
  ): Promise<RecipeType> {
    return this.recipeService.create(recipe, decodedJwt.sub);
  }

  @UseGuards(JwtAuthGuard, RecipeCreatorGuard)
  @Mutation(() => MessageType)
  async deleteRecipe(@Args() idArg: IdArg): Promise<MessageType> {
    const deleteResult = await this.recipeService.delete(idArg);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Recipe with id ${idArg.id} was not found`);
    }
    return { message: 'Recipe successfully deleted' };
  }
}
