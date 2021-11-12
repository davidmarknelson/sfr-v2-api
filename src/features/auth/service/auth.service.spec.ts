import { UserEntity } from '@api/features/user/entity';
import { UserService } from '@api/features/user/service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

const userData: UserEntity = {
  id: 1,
  username: 'user1',
  password: 'password',
  email: 'email@email.com',
  emailVerified: false,
};
let user: UserEntity | null = userData;

describe('AuthService', () => {
  let service: AuthService;
  let bcryptCompare: jest.Mock;
  let bcryptHash: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('accessToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return a valid user', async () => {
      user = userData;
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      expect(
        await service.validateUser({
          email: 'email@email.com',
          password: 'password',
        }),
      ).toEqual(userData);
    });

    it('should return null if the password is incorrect', async () => {
      user = userData;
      bcryptCompare = jest.fn().mockReturnValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      expect(
        await service.validateUser({
          email: 'email@email.com',
          password: 'wrong-password',
        }),
      ).toEqual(null);
    });

    it('should return null if the user is not found', async () => {
      user = null;

      expect(
        await service.validateUser({
          email: 'email@email.com',
          password: 'wrong-password',
        }),
      ).toEqual(null);
    });
  });

  describe('signToken', () => {
    it('should return an access token', async () => {
      expect(await service.signToken(userData)).toEqual({
        accessToken: 'accessToken',
      });
    });
  });

  describe('createPasswordHash', () => {
    it('should return a hashed password', async () => {
      bcryptHash = jest.fn().mockReturnValue('hashedPassword');
      (bcrypt.hash as jest.Mock) = bcryptHash;

      expect(await service.createPasswordHash(userData)).toEqual(
        'hashedPassword',
      );
    });
  });
});
