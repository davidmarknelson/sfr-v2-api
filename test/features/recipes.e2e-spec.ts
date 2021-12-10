import { AppModule } from '@api/app.module';
import { Difficulty } from '@api/features/recipe/dto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import {
  AuthQueriesAndMutations,
  RecipeQueriesAndMutations,
  Support,
} from '../support';

describe('RecipesResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('No recipes', () => {
    beforeEach(async () => {
      await getConnection().synchronize(true);
    });

    it('should return an empty array and the correct count (0)', () => {
      return request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .send(RecipeQueriesAndMutations.allRecipesQuery())
        .expect(200)
        .expect({ data: { recipesAndCount: { recipes: [], totalCount: 0 } } });
    });
  });

  describe('Multiple recipes', () => {
    beforeEach(async () => {
      await getConnection().synchronize(true);
      await Support.createRecipes(app);
    });

    it('should return an array and the correct count (8)', () => {
      return request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .send(RecipeQueriesAndMutations.allRecipesQuery())
        .expect(200)
        .then((data) => {
          expect(data.body.data.recipesAndCount.recipes.length).toEqual(8);
          expect(data.body.data.recipesAndCount.totalCount).toEqual(8);
        });
    });
  });

  describe('Individual recipe', () => {
    beforeEach(async () => {
      await getConnection().synchronize(true);
      await Support.createRecipes(app);
    });

    it('should return a recipe', () => {
      return request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .send(RecipeQueriesAndMutations.recipeQuery('Egg-muffin'))
        .expect(200)
        .then((data) => {
          expect(data.body.data.recipe.name).toEqual('Egg muffin');
        });
    });

    it('should return an error if there is not a matching recipe', () => {
      return request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .send(RecipeQueriesAndMutations.recipeQuery('Not a recipe'))
        .expect(200)
        .then((data) => {
          expect(data.body.errors).toHaveLength(1);
          expect(data.body.errors[0].message).toEqual('Not Found');
          expect(data.body.data).toEqual(null);
        });
    });
  });

  describe('Create recipe', () => {
    let token: string;
    beforeEach(async () => {
      await getConnection().synchronize(true);
      await Support.createUser(app);
      await request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.loginQuery('email@email.com', 'password!234'),
        )
        .then((res) => {
          token = res.body.data.login.accessToken;
        });
    });

    it('should create a recipe with a photo', async () => {
      return request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .set('Authorization', 'Bearer ' + token)
        .send(
          RecipeQueriesAndMutations.recipeCreateMutation({
            name: 'New Recipe with photo',
            description: 'Description of recipe',
            ingredients: ['2 large eggs', '1 small slice of ham'],
            instructions: ['Whisk eggs', 'Spray the muffin tray with oil'],
            cookTime: 20,
            difficulty: Difficulty.One,
            photos: [
              {
                path: 'https://res.cloudinary.com/dcwjkxleo/image/upload/v1579036167/sfr_unsigned/dxn8zrmi9wymwfrvdx4m.jpg',
                cloudinaryPublicId: 'sfr_unsigned/dxn8zrmi9wymwfrvdx4m',
              },
            ],
          }),
        )
        .expect(200)
        .then((data) => {
          expect(data.body.data.createRecipe.name).toEqual(
            'New Recipe with photo',
          );
          expect(data.body.data.createRecipe.ingredients).toHaveLength(2);
          expect(data.body.data.createRecipe.photos).toHaveLength(1);
          expect(data.body.data.createRecipe.photos[0].path).not.toEqual(null);
        });
    });

    it('should create a recipe without a photo', () => {
      return request(app.getHttpServer())
        .post(RecipeQueriesAndMutations.graphqlEndpoint)
        .set('Authorization', 'Bearer ' + token)
        .send(
          RecipeQueriesAndMutations.recipeCreateMutation({
            name: 'New Recipe without photo',
            description: 'Description of recipe',
            ingredients: ['2 large eggs', '1 small slice of ham'],
            instructions: ['Whisk eggs', 'Spray the muffin tray with oil'],
            cookTime: 20,
            difficulty: Difficulty.One,
            photos: [],
          }),
        )
        .expect(200)
        .then((data) => {
          expect(data.body.data.createRecipe.name).toEqual(
            'New Recipe without photo',
          );
          expect(data.body.data.createRecipe.ingredients).toHaveLength(2);
          expect(data.body.data.createRecipe.photos).toEqual([]);
        });
    });
  });
});
