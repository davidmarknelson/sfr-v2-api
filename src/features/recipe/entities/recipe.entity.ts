import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 256,
  })
  name: string;
}
