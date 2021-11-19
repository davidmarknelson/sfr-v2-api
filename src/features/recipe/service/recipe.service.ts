import { IdArg, NameArg, PaginationArg } from '@api/data-access/dto';
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
      relations: ['photos', 'creator'],
    });
  }

  findOneByName(@Args() nameArg: NameArg): Promise<RecipeEntity> {
    return this.recipeRepository.findOne({
      where: { name: nameArg },
      relations: ['photos', 'creator'],
    });
  }

  findOneById(@Args() idArg: IdArg): Promise<RecipeEntity> {
    return this.recipeRepository.findOne({
      where: idArg,
      relations: ['creator'],
    });
  }

  create(@Args() recipe: RecipeInput, creatorId: number): Promise<RecipeType> {
    return this.recipeRepository.save({
      ...recipe,
      creator: { id: creatorId },
    });
  }

  delete(@Args() IdArg: IdArg): Promise<DeleteResult> {
    return this.recipeRepository.delete(IdArg);
  }
}
