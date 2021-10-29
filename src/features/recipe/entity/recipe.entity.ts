import { RecipePhotoEntity } from '@api/features/recipe-photo/entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Difficulty } from '../dto';

@Entity('recipe')
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
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

  @OneToMany(() => RecipePhotoEntity, (recipePhoto) => recipePhoto.recipe, {
    cascade: true,
    nullable: true,
  })
  photos: RecipePhotoEntity[];
}
