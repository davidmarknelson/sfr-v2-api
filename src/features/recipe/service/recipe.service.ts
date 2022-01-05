import { IdArg, NameArg, PaginationArg } from '@api/data-access/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RecipeEditInput, RecipeInput, RecipeType } from '../dto';
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
      relations: ['creator', 'photos'],
    });
  }

  async create(
    @Args() recipe: RecipeInput,
    creatorId: number,
  ): Promise<RecipeType> {
    const savedRecipe = await this.recipeRepository.save({
      ...recipe,
      creator: { id: creatorId },
    });
    return this.findOneById({ id: savedRecipe.id });
  }

  async edit(@Args() recipe: RecipeEditInput): Promise<RecipeEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, photos, ...formattedRecipe } = recipe;
    const updateRecipeResults = await this.recipeRepository.update(
      id,
      formattedRecipe,
    );
    if (!updateRecipeResults.affected) {
      throw new NotFoundException();
    }
    return this.findOneById({ id });
  }

  delete(@Args() IdArg: IdArg): Promise<DeleteResult> {
    return this.recipeRepository.delete(IdArg);
  }
}
