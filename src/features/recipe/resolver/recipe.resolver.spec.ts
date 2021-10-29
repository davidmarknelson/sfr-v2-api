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
            delete: jest.fn().mockResolvedValue({ raw: [], affected: 1 }),
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
    it('should return an array of recipes and the total count', async () => {
      const recipesAndCount: RecipesAndCountType = {
        totalCount: 1,
        recipes: [recipe],
      };
      const serviceSpy = jest.spyOn(service, 'findAllAndCount');
      expect(await resolver.recipesAndCount({ skip: 0, take: 9 })).toEqual(
        recipesAndCount,
      );
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('recipe', () => {
    it('should return a recipe', async () => {
      const serviceSpy = jest.spyOn(service, 'findOneById');
      expect(await resolver.recipe({ id: 1 })).toEqual(recipe);
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should return a not found if there is no recipe', async () => {
      const serviceSpy = jest
        .spyOn(service, 'findOneById')
        .mockResolvedValue(undefined);
      await expect(resolver.recipe({ id: 1 })).rejects.toThrowError(
        NotFoundException,
      );
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('createRecipe', () => {
    it('should create and return a recipe', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        await resolver.createRecipe({
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
      ).toEqual(recipe);
      expect(serviceSpy).toHaveBeenCalled();
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe and return a message', async () => {
      const serviceSpy = jest.spyOn(service, 'delete');
      expect(
        await resolver.deleteRecipe({
          id: 1,
        }),
      ).toEqual({ message: 'Recipe successfully deleted' });
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should throw an error when the delete did not delete a row in the database', async () => {
      const serviceSpy = jest
        .spyOn(service, 'delete')
        .mockResolvedValue({ raw: [], affected: 0 });
      await expect(
        resolver.deleteRecipe({
          id: 1,
        }),
      ).rejects.toThrowError('Recipe with id 1 was not found');
      expect(serviceSpy).toHaveBeenCalled();
    });
  });
});
