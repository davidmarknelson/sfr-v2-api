import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthQueriesAndMutations, RecipeQueriesAndMutations } from '.';
import { Recipes } from '../fixtures';

export class Support {
  static async createRecipes(app: INestApplication): Promise<void> {
    let token: string;
    await Support.createUser(app);
    await request(app.getHttpServer())
      .post(AuthQueriesAndMutations.graphqlEndpoint)
      .send(
        AuthQueriesAndMutations.loginQuery('email@email.com', 'password!234'),
      )
      .then((res) => {
        token = res.body.data.login.accessToken;
      });
    for (let i = 0; i < Recipes.recipes.length; i++) {
      await request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .set('Authorization', 'Bearer ' + token)
        .send(
          RecipeQueriesAndMutations.recipeCreateMutation(Recipes.recipes[i]),
        );
    }
  }
  static createUser(app: INestApplication): request.Test {
    return request(app.getHttpServer())
      .post(AuthQueriesAndMutations.graphqlEndpoint)
      .send(
        AuthQueriesAndMutations.signupMutation(
          'email@email.com',
          'password!234',
          'some-user',
        ),
      );
  }
}
