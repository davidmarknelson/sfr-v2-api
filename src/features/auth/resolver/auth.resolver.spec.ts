import { UserEntity } from '@api/features/user/entity';
import { UserService } from '@api/features/user/service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenType } from '../dto';
import { AuthService } from '../service';
import { AuthResolver } from './auth.resolver';

const userEntity: UserEntity = {
  id: 1,
  username: 'some-username',
  password: 'some-hash',
  email: 'email@email.com',
  emailVerified: false,
};

const accessToken: AccessTokenType = {
  accessToken: 'someToken',
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            signToken: jest.fn().mockResolvedValue(accessToken),
            createPasswordHash: jest.fn().mockResolvedValue('somehash'),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(userEntity),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const serviceSpy = jest.spyOn(authService, 'signToken');
      expect(
        await resolver.login(userEntity, {
          email: 'email@email.com',
          password: 'password1234',
        }),
      ).toEqual(accessToken);
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should return an access token', async () => {
      const authPasswordHashSpy = jest.spyOn(authService, 'signToken');
      const authSignTokenSpy = jest.spyOn(authService, 'signToken');
      const userCreateSpy = jest.spyOn(userService, 'create');
      expect(
        await resolver.signup({
          username: 'some-username',
          email: 'email@email.com',
          password: 'password1234',
        }),
      ).toEqual(accessToken);
      expect(authPasswordHashSpy).toHaveBeenCalled();
      expect(authSignTokenSpy).toHaveBeenCalled();
      expect(userCreateSpy).toHaveBeenCalled();
    });
  });
});
