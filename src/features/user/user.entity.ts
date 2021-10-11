import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    length: 256,
  })
  username: string;

  @Field(() => [Recipe])
  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}
