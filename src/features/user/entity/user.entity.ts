import { RecipeEntity } from '@api/features/recipe/entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.creator, {
    cascade: true,
    nullable: true,
  })
  recipes?: RecipeEntity[];
}
