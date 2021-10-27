import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';

@Entity('recipe_photo')
export class RecipePhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @OneToOne(() => RecipeEntity, (recipe) => recipe.photo)
  @JoinColumn()
  recipe: RecipeEntity;
}
