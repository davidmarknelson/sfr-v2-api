import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '../dto';
import { UserService } from '../service';
import { UserResolver } from './user.resolver';

const user: UserType = {
  id: 1,
  username: 'some-user',
  email: 'email@email.com',
  recipes: [],
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('user', () => {
    it('should return a user', async () => {
      const serviceSpy = jest.spyOn(userService, 'findOneById');
      expect(await resolver.profile({ username: 'some-user', sub: 1 })).toEqual(
        user,
      );
      expect(serviceSpy).toHaveBeenCalled();
    });
  });
});
