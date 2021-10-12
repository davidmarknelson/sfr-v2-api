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
  let recipeService: RecipeService;
  let recipeRepository: Repository<Recipe>;

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

    recipeService = moduleRef.get<RecipeService>(RecipeService);
    recipeRepository = moduleRef.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
  });

  it('should be defined', () => {
    expect(recipeService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const repoSpy = jest.spyOn(recipeRepository, 'find');
      expect(recipeService.findAll()).resolves.toEqual([recipe]);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a recipe', async () => {
      const repoSpy = jest.spyOn(recipeRepository, 'findOne');
      expect(recipeService.findOneById(1)).resolves.toEqual(recipe);
      expect(repoSpy).toHaveBeenCalled();
    });
  });
});
