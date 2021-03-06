import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhotoEntity } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipePhotoEntity])],
  providers: [RecipePhotoEntity],
})
export class RecipePhotoModule {}
