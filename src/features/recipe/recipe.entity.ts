import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { RecipePhoto } from '../recipe-photo/recipe-photo.entity';

@ObjectType()
@Entity()
export class Recipe {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => RecipePhoto)
  @OneToOne(() => RecipePhoto, (recipePhoto) => recipePhoto.recipe)
  photo: RecipePhoto;
}
