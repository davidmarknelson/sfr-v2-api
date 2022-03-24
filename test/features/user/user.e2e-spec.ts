import { AppModule } from '@api/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { Support, UserQueriesAndMutations } from '../../support';

describe('UserResolver (e2e)', () => {
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

  describe('Profile', () => {
    let token: string;
    beforeEach(async () => {
      await getConnection().synchronize(true);
      await Support.createUser(app).then((res) => {
        token = res.body.data.signup.accessToken;
      });
    });

    it('should return the user that is in the bearer token', () => {
      return request(app.getHttpServer())
        .post(UserQueriesAndMutations.graphqlEndpoint)
        .set('Authorization', 'Bearer ' + token)
        .send(UserQueriesAndMutations.profileQuery())
        .expect(200)
        .then((data) => {
          expect(data.body.data.profile.id).toEqual(1);
          expect(data.body.data.profile.username).toEqual('some-user');
        });
    });
  });
});
