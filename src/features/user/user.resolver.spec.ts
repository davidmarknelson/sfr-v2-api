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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockReturnValue([user]),
            findOneById: jest.fn().mockReturnValue(user),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('users', () => {
    it('should return an array of users', () => {
      expect(resolver.users()).toEqual([user]);
    });
  });

  describe('user', () => {
    it('should return a user', () => {
      expect(resolver.user(1)).toEqual(user);
    });
  });
});
