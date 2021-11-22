import { UserEntity } from '@api/features/user/entity';
import { UserService } from '@api/features/user/service';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenType } from '../dto';
import { AuthService } from '../service';
import { AuthResolver } from './auth.resolver';

const userEntity: UserEntity = {
  id: 1,
  username: 'some-username',
  password: 'some-hash',
  email: 'email@email.com',
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
            validateUser: jest.fn().mockResolvedValue(userEntity),
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
      const serviceValidateUserSpy = jest.spyOn(authService, 'validateUser');
      const serviceSignTokenSpy = jest.spyOn(authService, 'signToken');
      expect(
        await resolver.login({
          email: 'email@email.com',
          password: 'password1234',
        }),
      ).toEqual(accessToken);
      expect(serviceSignTokenSpy).toHaveBeenCalled();
      expect(serviceValidateUserSpy).toHaveBeenCalled();
    });

    it('should throw an unauthorized exception if no user is found', async () => {
      const serviceValidateUserSpy = jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(null);
      const serviceSignTokenSpy = jest.spyOn(authService, 'signToken');
      await expect(
        resolver.login({
          email: 'email@email.com',
          password: 'password1234',
        }),
      ).rejects.toEqual(
        new UnauthorizedException('Email or password is incorrect'),
      );
      expect(serviceSignTokenSpy).not.toHaveBeenCalled();
      expect(serviceValidateUserSpy).toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should return an access token', async () => {
      const authPasswordHashSpy = jest.spyOn(authService, 'createPasswordHash');
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

  describe('refreshToken', () => {
    it('should return an access token', async () => {
      const authSignTokenSpy = jest.spyOn(authService, 'signToken');
      expect(
        await resolver.refreshToken({
          username: 'some-username',
          sub: 1,
        }),
      ).toEqual(accessToken);
      expect(authSignTokenSpy).toHaveBeenCalled();
    });
  });
});
