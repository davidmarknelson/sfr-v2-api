import { Difficulty } from '@api/features/recipe/models';
import { RecipeEntity } from '@api/features/recipe/recipe.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRecipes1634589967240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<RecipeEntity>(RecipeEntity, {
        name: 'Sandwhich',
        description: 'A delicious sandwhich',
        ingredients: ['bread', 'meat', 'cheese', 'sauce'],
        instructions: ['put the ingredients together', 'eat'],
        cookTime: 5,
        difficulty: Difficulty.ONE,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM recipe;');
  }
}
