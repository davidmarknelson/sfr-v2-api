import { RecipePhotoEntity } from '@api/features/recipe-photo/entity';
import { UserEntity } from '@api/features/user/entity';
import { apiRecipeConstants } from '@api/utilities/constants';
import { IsIn } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipes')
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: apiRecipeConstants.nameMaxLength, unique: true })
  name: string;

  @Column({ length: apiRecipeConstants.descriptionMaxLength })
  description: string;

  @Column({ type: 'varchar', array: true })
  ingredients: string[];

  @Column({ type: 'varchar', array: true })
  instructions: string[];

  @Column('int')
  cookTime: number;

  @IsIn([1, 2, 3, 4, 5], { message: 'Difficulty must be between 1 - 5' })
  @Column({ type: 'int' })
  difficulty: number;

  @OneToMany(() => RecipePhotoEntity, (recipePhoto) => recipePhoto.recipe, {
    cascade: true,
    nullable: true,
  })
  photos: RecipePhotoEntity[];

  @ManyToOne(() => UserEntity, (user) => user.recipes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  creator: UserEntity;
}
