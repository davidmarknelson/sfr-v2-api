import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipePhotoEntity } from '../recipe-photo/recipe-photo.entity';
import { Difficulty } from './models';

@Entity('recipe')
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 512 })
  description: string;

  @Column({ type: 'varchar', array: true })
  ingredients: string[];

  @Column({ type: 'varchar', array: true })
  instructions: string[];

  @Column('int')
  cookTime: number;

  @Column({ type: 'enum', enum: Difficulty })
  difficulty: number;

  @OneToOne(() => RecipePhotoEntity, (recipePhoto) => recipePhoto.recipe, {
    nullable: true,
  })
  @JoinColumn()
  photo: RecipePhotoEntity;
}
