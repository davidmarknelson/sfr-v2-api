import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhotoEntity } from './recipe-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipePhotoEntity])],
  providers: [RecipePhotoEntity],
})
export class RecipePhotoModule {}
