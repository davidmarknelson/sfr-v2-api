import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { RecipePhotoEntity } from '../recipe-photo/recipe-photo.entity';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => RecipePhotoEntity, (recipePhoto) => recipePhoto.recipe)
  photo: RecipePhotoEntity;
}
