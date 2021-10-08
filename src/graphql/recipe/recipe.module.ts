import { Module } from '@nestjs/common';
import { RecipeResolver } from './resolvers';

@Module({
  providers: [RecipeResolver],
})
export class RecipeModule {}
