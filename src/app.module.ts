import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhotoModule } from './features/recipe-photo/recipe-photo.module';
import { RecipeModule } from './features/recipe/recipe.module';
import { ApiTestingModule } from './testing/testing.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
      cors: {
        origin: 'http://localhost:4200',
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dmnelson',
      password: null,
      database: 'sfr2_dev',
      synchronize: true,
      autoLoadEntities: true,
    }),
    RecipeModule,
    RecipePhotoModule,
    ApiTestingModule,
  ],
})
export class AppModule {}
