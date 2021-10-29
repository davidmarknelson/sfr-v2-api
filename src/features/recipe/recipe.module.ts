import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entity';
import { RecipeResolver } from './resolver';
import { RecipeService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeEntity, RecipeResolver, RecipeService],
})
export class RecipeModule {}
