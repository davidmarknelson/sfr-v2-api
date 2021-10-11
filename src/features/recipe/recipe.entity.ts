import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Recipe {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    length: 256,
  })
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.recipes)
  user: User;
}
