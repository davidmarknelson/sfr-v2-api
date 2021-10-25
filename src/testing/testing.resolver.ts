import { Difficulty } from '@api/features/recipe/models';
import { RecipeEntity } from '@api/features/recipe/recipe.entity';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { getManager } from 'typeorm';
import { TestingType } from './models';

@Resolver()
export class TestingResolver {
  @Mutation(() => TestingType)
  async addRecipes(
    @Args({ name: 'numberOfRecipes', type: () => Int, defaultValue: 1 })
    numberOfRecipes = 1,
  ): Promise<TestingType> {
    const entityManager = getManager();
    for (let i = 0; i < numberOfRecipes; i++) {
      await entityManager.save(RecipeEntity, {
        name: 'Sandwich',
        description: 'A delicious sandwich',
        ingredients: ['bread', 'meat', 'cheese', 'sauce'],
        instructions: ['put the ingredients together', 'eat'],
        cookTime: 5,
        difficulty: Difficulty.ONE,
      });
    }
    return { message: 'Recipes created' };
  }

  @Mutation(() => TestingType)
  async deleteAllRecipes(): Promise<TestingType> {
    const entityManager = getManager();
    await entityManager
      .createQueryBuilder()
      .delete()
      .from(RecipeEntity)
      .execute();
    return { message: 'All recipes deleted' };
  }
}
