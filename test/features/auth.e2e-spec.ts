import { AppModule } from '@api/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

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
            'password!234',
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
              'password!234',
              'some-new-user',
            ),
          )
          .expect(200)
          .then((res) => {
            expect(res.body.data).toEqual(null);
            expect(res.body.errors[0].extensions.response.message).toEqual(
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
              'password!234',
              'some-user',
            ),
          )
          .expect(200)
          .then((res) => {
            expect(res.body.data).toEqual(null);
            expect(res.body.errors[0].extensions.response.message).toEqual(
              'An account with this email or username already exists',
            );
            expect(res.body.errors[0].extensions.response.statusCode).toEqual(
              400,
            );
          }),
      );
    });

    it('should return an error if the email is not an email', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'notAnEmail',
            'password!234',
            'some-user',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Email must be an email',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the username is too short', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            'password!234',
            'asdf',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Username must be between 5 and 25 characters long',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the username is too long', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            'password!234',
            'asdfasdfasdfasdfasdfasdfasdf',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Username must be between 5 and 25 characters long',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the username contains a space', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            'password!234',
            'some user',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Username must not contain a space',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the password is fewer than 12 characters long', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            'password!23',
            'some-user',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Password must contain a letter, a number, a special character, and be at least 12 characters long',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the password does not contain a special character', () => {
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
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Password must contain a letter, a number, a special character, and be at least 12 characters long',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the password does not contain a letter', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            '12341234!234',
            'some-user',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Password must contain a letter, a number, a special character, and be at least 12 characters long',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
    });

    it('should return an error if the password does not contain a number', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .send(
          AuthQueriesAndMutations.signupMutation(
            'email@email.com',
            'password!asd',
            'some-user',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual([
            'Password must contain a letter, a number, a special character, and be at least 12 characters long',
          ]);
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            400,
          );
        });
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
          AuthQueriesAndMutations.loginQuery('email@email.com', 'password!234'),
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
          expect(res.body.errors[0].extensions.response.message).toEqual(
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
            'password!234',
          ),
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual(null);
          expect(res.body.errors[0].extensions.response.message).toEqual(
            'Email or password is incorrect',
          );
          expect(res.body.errors[0].extensions.response.statusCode).toEqual(
            401,
          );
        });
    });
  });

  describe('Refresh', () => {
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

    it('should return an access token', () => {
      return request(app.getHttpServer())
        .post(AuthQueriesAndMutations.graphqlEndpoint)
        .set('Authorization', 'Bearer ' + token)
        .send(AuthQueriesAndMutations.refreshTokenQuery())
        .expect(200)
        .then((res) => {
          expect(res.body.data.refreshToken).toHaveProperty('accessToken');
          expect(typeof res.body.data.refreshToken.accessToken).toEqual(
            'string',
          );
        });
    });
  });
});
