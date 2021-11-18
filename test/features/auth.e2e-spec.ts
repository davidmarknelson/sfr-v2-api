import { AppModule } from '@api/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AuthQueriesAndMutations, Support } from '../support';

describe('AuthResolver (e2e)', () => {
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

  describe('Signup', () => {
    beforeEach(async () => {
      await getConnection().synchronize(true);
    });

    it('should return an access token for the new user', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            'password1234',
            'some-user',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data.signup).toHaveProperty('accessToken');
          expect(typeof res.body.data.signup.accessToken).toEqual('string');
        });
    });

    it('should return an error if a user with the same email already exists', () => {
      return Support.createUser(app).then(() =>
        request(app.getHttpServer())
          .post(AuthQueriesAndMutations.graphqlEndpoint)
          .send(
            AuthQueriesAndMutations.signupMutation(
              'email@email.com',
              'password1234',
              'some-new-user',
            ),
          )
          .expect(200)
          .then((res) => {
            expect(res.body.data).toEqual(null);
            expect(res.body.errors[0].message).toEqual(
              'An account with this email or username already exists',
            );
            expect(res.body.errors[0].extensions.response.statusCode).toEqual(
              400,
            );
          }),
      );
    });

    it('should return an error if a user with the same username already exists', () => {
      return Support.createUser(app).then(() =>
        request(app.getHttpServer())
          .post(AuthQueriesAndMutations.graphqlEndpoint)
          .send(
            AuthQueriesAndMutations.signupMutation(
              'new-email@email.com',
              'password1234',
              'some-user',
            ),
          )
          .expect(200)
          .then((res) => {
            expect(res.body.data).toEqual(null);
            expect(res.body.errors[0].message).toEqual(
              'An account with this email or username already exists',
            );
            expect(res.body.errors[0].extensions.response.statusCode).toEqual(
              400,
            );
          }),
      );
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await getConnection().synchronize(true);
      await Support.createUser(app);
    });

    it('should return an access token', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.loginQuery('email@email.com', 'password1234'),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data.login).toHaveProperty('accessToken');
          expect(typeof res.body.data.login.accessToken).toEqual('string');
        });
    });

    it('should return an error if the password is incorrect', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.loginQuery(
            'email@email.com',
            'wrong-password',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].message).toEqual(
            'Email or password is incorrect',
          );
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            401,
          );
        });
    });

    it('should return an error if the email is incorrect', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.loginQuery(
            'wrong-email@email.com',
            'password1234',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].message).toEqual(
            'Email or password is incorrect',
          );
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            401,
          );
        });
    });
  });
});
