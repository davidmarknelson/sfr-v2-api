import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEnv, validate } from './env.validation';
import { ApiTestingModule } from './features/api-testing/api-testing.module';
import { AuthModule } from './features/auth/auth.module';
import { RecipePhotoModule } from './features/recipe-photo/recipe-photo.module';
import { RecipeModule } from './features/recipe/recipe.module';
import { UserModule } from './features/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      envFilePath:
        process.env.NODE_ENV === NodeEnv.Test ? ['.test.env'] : ['.env'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      // Debugging purposes
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: {
        origin: process.env.CLIENT_URL,
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
      synchronize: JSON.parse(process.env.TYPEORM_SYNCRONIZE),
      autoLoadEntities: true,
      ssl:
        process.env.NODE_ENV === NodeEnv.Production
          ? {
              rejectUnauthorized: false,
            }
          : false,
    }),
    RecipeModule,
    RecipePhotoModule,
    UserModule,
    AuthModule,
    ApiTestingModule,
  ],
})
export class AppModule {}
