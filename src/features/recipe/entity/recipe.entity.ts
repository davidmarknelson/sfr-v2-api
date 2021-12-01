import { RecipePhotoEntity } from '@api/features/recipe-photo/entity';
import { UserEntity } from '@api/features/user/entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Difficulty } from '../dto';

@Entity('recipes')
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, unique: true })
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
  difficulty: Difficulty;

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
