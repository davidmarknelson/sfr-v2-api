import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeType } from './recipe';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

const recipe: RecipeType = {
  id: 1,
  name: 'sandwich',
  photo: {
    id: 1,
    path: '/recipe-photo/1',
  },
};

describe('RecipeService', () => {
  let service: RecipeService;
  let repo: Repository<RecipeEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([recipe]),
            findOne: jest.fn().mockResolvedValue(recipe),
          },
        },
        RecipeService,
      ],
    }).compile();

    service = moduleRef.get<RecipeService>(RecipeService);
    repo = moduleRef.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const repoSpy = jest.spyOn(repo, 'find');
      expect(service.findAll()).resolves.toEqual([recipe]);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a recipe', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(service.findOneById(1)).resolves.toEqual(recipe);
      expect(repoSpy).toHaveBeenCalled();
    });
  });
});
