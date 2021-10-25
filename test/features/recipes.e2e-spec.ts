import { AppModule } from '@api/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('RecipesResolver (e2e)', () => {
  let app: INestApplication;
  const graphqlEndpoint = '/graphql';

  beforeEach(async () => {
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
    it('should return an empty array and the correct count (0)', () => {
      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
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
        })
        .expect(200)
        .expect({ data: { recipesAndCount: { recipes: [], totalCount: 0 } } });
    });
  });
});
