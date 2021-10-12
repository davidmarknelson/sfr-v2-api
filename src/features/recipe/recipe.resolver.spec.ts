import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';

const recipe = {
  id: 1,
  name: 'sandwich',
  user: { id: 1, username: 'user1', recipes: [] },
};

describe('RecipeResolver', () => {
  let resolver: RecipeResolver;
  let service: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeResolver,
        {
          provide: RecipeService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([recipe]),
            findOneById: jest.fn().mockResolvedValue(recipe),
          },
        },
      ],
    }).compile();

    resolver = module.get<RecipeResolver>(RecipeResolver);
    service = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('recipes', () => {
    it('should return an array of recipes', () => {
      const serviceSpy = jest.spyOn(service, 'findAll');
      expect(resolver.recipes()).resolves.toEqual([recipe]);
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('recipe', () => {
    it('should return a recipe', () => {
      const serviceSpy = jest.spyOn(service, 'findOneById');
      expect(resolver.recipe(1)).resolves.toEqual(recipe);
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should return a not found if there is no recipe', () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(undefined);
      expect(resolver.recipe(1)).rejects.toThrowError(NotFoundException);
    });
  });
});
