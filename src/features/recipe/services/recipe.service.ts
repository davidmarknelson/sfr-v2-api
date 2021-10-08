import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from '../entities';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipesRepository: Repository<RecipeEntity>,
  ) {}

  findAll(): Promise<RecipeEntity[]> {
    return this.recipesRepository.find();
  }

  // async remove(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
