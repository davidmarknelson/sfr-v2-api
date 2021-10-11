import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeModule } from './features/recipe/recipe.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
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
    UserModule,
  ],
})
export class AppModule {}
