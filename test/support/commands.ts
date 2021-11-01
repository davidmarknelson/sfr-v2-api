import { RecipeEntity } from '@api/features/recipe/entity';
import { getConnection, InsertResult } from 'typeorm';
import { Recipes } from '../fixtures';

export class Support {
  static createRecipes(): Promise<InsertResult> {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(RecipeEntity)
      .values(Recipes.recipes)
      .execute();
  }
}
