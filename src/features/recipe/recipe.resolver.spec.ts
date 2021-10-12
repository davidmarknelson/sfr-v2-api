import { Test, TestingModule } from '@nestjs/testing';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';

const recipe = {
  id: 1,
  name: 'sandwich',
  user: { id: 1, username: 'user1', recipes: [] },
};

class MockRecipeService {
  findAll() {
    // return jest.fn().mockResolvedValue([recipe]);
    return [recipe];
  }
  findOneById() {
    return jest.fn().mockResolvedValue(recipe);
  }
}

describe('CatResolver', () => {
  let resolver: RecipeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeResolver,
        {
          provide: RecipeService,
          useValue: {
            findAll: jest.fn().mockReturnValue([recipe]),
            findOneById: jest.fn().mockReturnValue(recipe),
          },
        },
      ],
    }).compile();

    resolver = module.get<RecipeResolver>(RecipeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('recipes', () => {
    it('should return an array of recipes', () => {
      expect(resolver.recipes()).toEqual([recipe]);
    });
  });

  describe('recipe', () => {
    it('should return a recipe', () => {
      expect(resolver.recipe(1)).toEqual(recipe);
    });
  });
});
