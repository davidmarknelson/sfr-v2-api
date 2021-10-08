import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entities';
import { RecipeResolver } from './resolvers';
import { RecipeService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeEntity, RecipeService, RecipeResolver],
})
export class RecipeModule {}
