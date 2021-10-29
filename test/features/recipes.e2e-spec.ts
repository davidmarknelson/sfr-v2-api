import { AppModule } from '@api/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Support } from '../support';

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
    beforeEach(() => {
      return Support.deleteAllRecipes(app);
    });

    it('should return an empty array and the correct count (0)', () => {
      return request(app.getHttpServer())
        .post(Support.graphqlEndpoint)
        .send(Support.allRecipesQuery())
        .expect(200)
        .expect({ data: { recipesAndCount: { recipes: [], totalCount: 0 } } });
    });
  });

  describe('Multiple recipes', () => {
    beforeEach(() => {
      return Support.createRecipes(app, 3);
    });

    it('should return an array and the correct count (3)', () => {
      return request(app.getHttpServer())
        .post(Support.graphqlEndpoint)
        .send(Support.allRecipesQuery())
        .expect(200)
        .then((data) => {
          expect(data.body.data.recipesAndCount.recipes.length).toEqual(3);
          expect(data.body.data.recipesAndCount.totalCount).toEqual(3);
        });
    });
  });
});
