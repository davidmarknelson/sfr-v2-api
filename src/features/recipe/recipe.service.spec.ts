import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeService } from './recipe.service';

const recipe = {
  id: 1,
  name: 'sandwich',
  user: { id: 1, username: 'user1', recipes: [] },
};

describe('RecipeService', () => {
  let service: RecipeService;
  let repo: Repository<Recipe>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            find: jest.fn().mockResolvedValue([recipe]),
            findOne: jest.fn().mockResolvedValue(recipe),
          },
        },
        RecipeService,
      ],
    }).compile();

    service = moduleRef.get<RecipeService>(RecipeService);
    repo = moduleRef.get<Repository<Recipe>>(getRepositoryToken(Recipe));
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
