import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Difficulty, RecipeType } from '../dto';
import { RecipeEntity } from '../entity';
import { RecipeService } from './recipe.service';

const recipe: RecipeType = {
  id: 1,
  name: 'sandwich',
  description: '',
  ingredients: [],
  instructions: [],
  cookTime: 0,
  difficulty: Difficulty.ONE,
  photos: [
    {
      id: 1,
      path: '/recipe-photo/1',
      cloudinaryPublicId: 'someId',
    },
  ],
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
            findAndCount: jest.fn().mockResolvedValue([[recipe], 1]),
            findOne: jest.fn().mockResolvedValue(recipe),
            save: jest.fn().mockResolvedValue(recipe),
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

  describe('findAllAndCount', () => {
    it('should return an array of recipes', async () => {
      const repoSpy = jest.spyOn(repo, 'findAndCount');
      expect(service.findAllAndCount({ skip: 0, take: 9 })).resolves.toEqual([
        [recipe],
        1,
      ]);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a recipe', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(service.findOneById({ id: 1 })).resolves.toEqual(recipe);
      expect(repoSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new recipe', async () => {
      const repoSpy = jest.spyOn(repo, 'save');
      expect(
        service.create({
          name: 'sandwich',
          description: '',
          ingredients: [],
          instructions: [],
          cookTime: 0,
          difficulty: Difficulty.ONE,
          photos: [
            {
              path: '/recipe-photo/1',
              cloudinaryPublicId: 'someId',
            },
          ],
        }),
      ).resolves.toEqual(recipe);
      expect(repoSpy).toHaveBeenCalled();
    });
  });
});
