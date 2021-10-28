import { IdArgs, PaginationArgs } from '@api/data-access';
import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeInput, RecipeType } from './models';
import { RecipeEntity } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
  ) {}

  findAllAndCount(
    @Args() paginationArgs: PaginationArgs,
  ): Promise<[RecipeEntity[], number]> {
    return this.recipeRepository.findAndCount({
      ...paginationArgs,
      relations: ['photo'],
    });
  }

  findOneById(@Args() idArgs: IdArgs): Promise<RecipeEntity> {
    return this.recipeRepository.findOne(idArgs);
  }

  create(@Args() recipe: RecipeInput): Promise<RecipeType> {
    return this.recipeRepository.save(recipe);
  }
}
