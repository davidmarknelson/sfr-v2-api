import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhotoModule } from './features/recipe-photo/recipe-photo.module';
import { RecipeModule } from './features/recipe/recipe.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
    }),
    TypeOrmModule.forRoot(),
    RecipeModule,
    RecipePhotoModule,
  ],
})
export class AppModule {}
