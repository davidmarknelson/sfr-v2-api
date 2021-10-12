import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';

@Entity()
export class RecipePhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @OneToOne(() => RecipeEntity, (recipe) => recipe.photo)
  recipe: RecipeEntity;
}
