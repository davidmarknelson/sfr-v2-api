import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipePhotoModule } from './features/recipe-photo/recipe-photo.module';
import { RecipeModule } from './features/recipe/recipe.module';
import { ApiTestingModule } from './testing/testing.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
      cors: {
        origin: process.env.CLIENT,
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      synchronize: !!+process.env.TYPEORM_SYNCRONIZE,
      autoLoadEntities: true,
    }),
    RecipeModule,
    RecipePhotoModule,
    ApiTestingModule,
  ],
})
export class AppModule {}
