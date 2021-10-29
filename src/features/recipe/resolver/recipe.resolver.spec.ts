import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Difficulty, RecipesAndCountType, RecipeType } from '../dto';
import { RecipeService } from '../service';
import { RecipeResolver } from './recipe.resolver';

const recipe: RecipeType = {
  id: 1,
  name: 'sandwich',
  ingredients: [],
  instructions: [],
  description: '',
  cookTime: 20,
  difficulty: Difficulty.ONE,
  photos: [
    {
      id: 1,
      path: '/recipe-photo/1',
      cloudinaryPublicId: 'someId',
    },
  ],
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
            findAllAndCount: jest.fn().mockResolvedValue([[recipe], 1]),
            findOneById: jest.fn().mockResolvedValue(recipe),
            create: jest.fn().mockResolvedValue(recipe),
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

  describe('recipesAndCount', () => {
    it('should return an array of recipes and the total count', () => {
      const recipesAndCount: RecipesAndCountType = {
        totalCount: 1,
        recipes: [recipe],
      };
      const serviceSpy = jest.spyOn(service, 'findAllAndCount');
      expect(resolver.recipesAndCount({ skip: 0, take: 9 })).resolves.toEqual(
        recipesAndCount,
      );
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('recipe', () => {
    it('should return a recipe', () => {
      const serviceSpy = jest.spyOn(service, 'findOneById');
      expect(resolver.recipe({ id: 1 })).resolves.toEqual(recipe);
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should return a not found if there is no recipe', () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(undefined);
      expect(resolver.recipe({ id: 1 })).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createRecipe', () => {
    it('should create and return a recipe', () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        resolver.createRecipe({
          name: 'sandwich',
          ingredients: [],
          instructions: [],
          description: '',
          cookTime: 20,
          difficulty: Difficulty.ONE,
          photos: [
            {
              path: '/recipe-photo/1',
              cloudinaryPublicId: 'someId',
            },
          ],
        }),
      ).resolves.toEqual(recipe);
      expect(serviceSpy).toHaveBeenCalled();
    });
  });
});