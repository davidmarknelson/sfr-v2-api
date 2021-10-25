import { AppModule } from '@api/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

const AllRecipesQuery = {
  query: `query recipesAndCount($skip: Float!, $take: Float!) {
  recipesAndCount(skip: $skip, take: $take) {
    recipes {
      id
      name
      description
      photo {
        id
        path
      }
    }
    totalCount
  }
}`,
  variables: {
    skip: 0,
    take: 9,
  },
};

describe('RecipesResolver (e2e)', () => {
  let app: INestApplication;
  const graphqlEndpoint = '/graphql';

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
    beforeEach(() => {
      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: `mutation deleteAllRecipe {
              deleteAllRecipes {
                message
              }
            }`,
        });
    });

    it('should return an empty array and the correct count (0)', () => {
      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send(AllRecipesQuery)
        .expect(200)
        .expect({ data: { recipesAndCount: { recipes: [], totalCount: 0 } } });
    });
  });

  describe('Multiple recipes', () => {
    beforeEach(() => {
      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: `mutation addRecipes($numberOfRecipes: Int) {
          addRecipes(numberOfRecipes: $numberOfRecipes) {
            message
          }
        }`,
          variables: {
            numberOfRecipes: 3,
          },
        });
    });

    afterEach(() => {
      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: `mutation deleteAllRecipe {
            deleteAllRecipes {
              message
            }
          }`,
        });
    });

    it('should return an array and the correct count (3)', () => {
      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send(AllRecipesQuery)
        .expect(200)
        .then((data) => {
          expect(data.body.data.recipesAndCount.recipes.length).toEqual(3);
        });
    });
  });
});
