import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
  ) {}

  findAll(): Promise<RecipeEntity[]> {
    return this.recipeRepository.find();
  }

  findOneById(id: number): Promise<RecipeEntity> {
    return this.recipeRepository.findOne(id);
  }
}
