import { RecipeEntity } from '@api/features/recipe/entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ length: 512, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.creator, {
    cascade: true,
    nullable: true,
  })
  recipes?: RecipeEntity[];
}
