import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@ObjectType()
@Entity()
export class RecipePhoto {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  path: string;

  @OneToOne(() => Recipe, (recipe) => recipe.photo)
  recipe: Recipe;
}
