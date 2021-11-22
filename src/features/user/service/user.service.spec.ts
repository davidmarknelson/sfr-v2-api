import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity';
import { UserService } from './user.service';

const user: UserEntity = {
  id: 1,
  username: 'user1',
  password: 'password',
  email: 'email@email.com',
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
            save: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('findOneByEmail', () => {
    it('should return a user', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(
        await service.findOneByEmail({ email: 'email@email.com' }),
      ).toEqual(user);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new recipe', async () => {
      const repoSpy = jest.spyOn(repo, 'save');
      expect(
        await service.create({
          username: 'user1',
          password: 'password',
          email: 'email@email.com',
        }),
      ).toEqual(user);
      expect(repoSpy).toHaveBeenCalled();
    });
  });
});
