import { RecipeEntity } from '@api/features/recipe/entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recipe_photos')
export class RecipePhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  cloudinaryPublicId: string;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.photos, {
    onDelete: 'CASCADE',
  })
  recipe: RecipeEntity;
}
