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
    it('should create and return a new user', async () => {
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

  describe('editProfile', () => {
    it('should edit and return the edited user', async () => {
      const usernameSpy = jest
        .spyOn(repo, 'findOne')
        .mockResolvedValueOnce(null);
      const emailSpy = jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      const saveSpy = jest.spyOn(repo, 'save');
      const getProfileSpy = jest.spyOn(repo, 'save').mockResolvedValueOnce({
        id: 1,
        username: 'newuser1',
        email: 'newemail@email.com',
        password: 'password',
      });
      expect(
        await service.editProfile(
          { id: 1 },
          {
            username: 'newuser1',
            email: 'newemail@email.com',
          },
        ),
      ).toEqual(user);
      expect(saveSpy).toHaveBeenCalled();
      expect(usernameSpy).toHaveBeenCalled();
      expect(emailSpy).toHaveBeenCalled();
      expect(getProfileSpy).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('should edit and return a message', async () => {
      const saveSpy = jest.spyOn(repo, 'save');
      expect(
        await service.updatePassword(
          { id: 1 },
          {
            password: 'newpassword',
          },
        ),
      ).toEqual({ message: 'Password updated' });
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a user', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(
        await service.findOneById({
          id: 1,
        }),
      ).toEqual(user);
      expect(repoSpy).toHaveBeenCalled();
    });
  });
});
