import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

const user = {
  id: 1,
  username: 'user1',
  recipes: [{ id: 1, name: 'sandwich', user: { id: 1, username: 'user1' } }],
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue([user]),
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
        UserService,
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    repo = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const repoSpy = jest.spyOn(repo, 'find');
      expect(service.findAll()).resolves.toEqual([user]);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a user', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(service.findOneById(1)).resolves.toEqual(user);
      expect(repoSpy).toHaveBeenCalled();
    });
  });
});
