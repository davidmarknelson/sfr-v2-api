import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const user = {
  id: 1,
  username: 'user1',
  recipes: [{ id: 1, name: 'sandwich', user: { id: 1, username: 'user1' } }],
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([user]),
            findOneById: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('users', () => {
    it('should return an array of users', () => {
      const serviceSpy = jest.spyOn(service, 'findAll');
      expect(resolver.users()).resolves.toEqual([user]);
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('user', () => {
    it('should return a user', () => {
      const serviceSpy = jest.spyOn(service, 'findOneById');
      expect(resolver.user(1)).resolves.toEqual(user);
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should return a not found if there is no user', () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(undefined);
      expect(resolver.user(1)).rejects.toThrowError(NotFoundException);
    });
  });
});
