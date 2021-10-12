import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhoto } from './recipe-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipePhoto])],
  providers: [RecipePhoto],
})
export class RecipePhotoModule {}
