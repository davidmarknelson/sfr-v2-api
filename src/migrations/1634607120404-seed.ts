import { Difficulty } from '@api/features/recipe/models';
import { RecipeEntity } from '@api/features/recipe/recipe.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seed1634607120404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<RecipeEntity>(RecipeEntity, {
        name: 'Sandwich',
        description: 'A delicious sandwich',
        ingredients: ['bread', 'meat', 'cheese', 'sauce'],
        instructions: ['put the ingredients together', 'eat'],
        cookTime: 5,
        difficulty: Difficulty.ONE,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
