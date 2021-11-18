import { RecipeEntity } from '@api/features/recipe/entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, InsertResult } from 'typeorm';
import { AuthQueriesAndMutations } from '.';
import { Recipes } from '../fixtures';

export class Support {
  static createRecipes(): Promise<InsertResult> {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(RecipeEntity)
      .values(Recipes.recipes)
      .execute();
  }
  static createUser(app: INestApplication): request.Test {
    return request(app.getHttpServer())
      .post(AuthQueriesAndMutations.graphqlEndpoint)
      .send(
        AuthQueriesAndMutations.signupMutation(
          'email@email.com',
          'password1234',
          'some-user',
        ),
      );
  }
}
