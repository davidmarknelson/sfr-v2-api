import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhotoEntity } from '../recipe-photo/entity';
import { RecipePhotoModule } from '../recipe-photo/recipe-photo.module';
import { RecipeEntity } from './entity';
import { RecipeResolver } from './resolver';
import { RecipeService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    TypeOrmModule.forFeature([RecipePhotoEntity]),
    RecipePhotoModule,
  ],
  providers: [RecipeEntity, RecipeResolver, RecipeService],
})
export class RecipeModule {}
