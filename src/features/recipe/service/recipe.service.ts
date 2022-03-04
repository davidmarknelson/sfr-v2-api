import { PsqlError } from '@api/data-access/constants';
import { IdArg, NameArg, PaginationArg } from '@api/data-access/dto';
import { RecipePhotoEntity } from '@api/features/recipe-photo/entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { DeleteResult, getConnection, Repository } from 'typeorm';
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

  async create(
    @Args() recipe: RecipeInput,
    creatorId: number,
  ): Promise<RecipeType> {
    try {
      const savedRecipe = await this.recipeRepository.save({
        ...recipe,
        creator: { id: creatorId },
      });

      return this.findOneById({ id: savedRecipe.id });
    } catch (err) {
      this.handleCreateEditErrors(err);
    }
  }

  async edit(@Args() recipe: RecipeEditInput): Promise<RecipeEntity> {
    try {
      const { id, photos, ...formattedRecipe } = recipe;

      const foundRecipe = await this.findOneById({ id });

      const recipePhotosToDelete = foundRecipe.photos.filter((currentPhoto) => {
        return !photos.find(
          (incommingPhoto) =>
            incommingPhoto.cloudinaryPublicId ===
            currentPhoto.cloudinaryPublicId,
        );
      });

      if (recipePhotosToDelete.length) {
        await Promise.all(
          recipePhotosToDelete.map((photoToDelete) =>
            cloudinary.uploader.destroy(photoToDelete.cloudinaryPublicId, {
              invalidate: true,
            }),
          ),
        );

        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(RecipePhotoEntity)
          .whereInIds(recipePhotosToDelete.map((photo) => photo.id))
          .execute();
      }

      await this.recipeRepository.save({
        id,
        ...formattedRecipe,
        photos: photos.map((photo) => {
          return { ...photo, recipeId: id };
        }),
      });
      return this.findOneById({ id });
    } catch (err) {
      this.handleCreateEditErrors(err);
    }
  }

  delete(@Args() IdArg: IdArg): Promise<DeleteResult> {
    return this.recipeRepository.delete(IdArg);
  }

  findOneById(@Args() idArg: IdArg): Promise<RecipeEntity> {
    return this.recipeRepository.findOne({
      where: idArg,
      relations: ['creator', 'photos'],
    });
  }

  private handleCreateEditErrors(err: any): void {
    if (err.code === PsqlError.UNIQUE && err.detail.includes('name')) {
      throw new BadRequestException('A recipe with that name already exists');
    } else if (
      err.code === PsqlError.UNIQUE &&
      (err.detail.includes('path') || err.detail.includes('cloudinaryPublicId'))
    ) {
      throw new BadRequestException('A recipe with that photo already exists');
    } else {
      throw new InternalServerErrorException('There was an error');
    }
  }
}
