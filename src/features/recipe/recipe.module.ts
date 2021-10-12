import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './recipe.entity';
import { RecipeResolver } from './recipe.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeEntity, RecipeResolver, RecipeService],
})
export class RecipeModule {}
