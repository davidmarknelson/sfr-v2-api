import { IdArgs, PaginationArgs } from '@api/data-access';
import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.recipeRepository.findAndCount(paginationArgs);
  }

  findOneById(@Args() idArgs: IdArgs): Promise<RecipeEntity> {
    return this.recipeRepository.findOne(idArgs);
  }
}
