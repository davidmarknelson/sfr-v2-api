import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeModule } from './features/recipe/recipe.module';
import { RecipeService } from './features/recipe/services';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dmnelson',
      password: null,
      database: 'sfr2_dev',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RecipeModule,
  ],
})
export class AppModule {}
