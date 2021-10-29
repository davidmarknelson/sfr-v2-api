import { IdArg, PaginationArg } from '@api/data-access';
import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RecipeInput, RecipeType } from '../dto';
import { RecipeEntity } from '../entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
  ) {}

  findAllAndCount(
    @Args() PaginationArg: PaginationArg,
  ): Promise<[RecipeEntity[], number]> {
    return this.recipeRepository.findAndCount({
      ...PaginationArg,
      relations: ['photos'],
    });
  }

  findOneById(@Args() IdArg: IdArg): Promise<RecipeEntity> {
    return this.recipeRepository.findOne(IdArg, { relations: ['photos'] });
  }

  create(@Args() recipe: RecipeInput): Promise<RecipeType> {
    return this.recipeRepository.save(recipe);
  }

  delete(@Args() IdArg: IdArg): Promise<DeleteResult> {
    return this.recipeRepository.delete(IdArg);
  }
}
