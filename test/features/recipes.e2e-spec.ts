import { AppModule } from '@api/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Support } from '../support';

describe('RecipesResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('No recipes', () => {
    beforeEach(() => {
      return Support.deleteAllRecipes(app);
    });

    it('should return an empty array and the correct count (0)', () => {
      return request(app.getHttpServer())
        .post(Support.graphqlEndpoint)
        .send(Support.allRecipesQuery())
        .expect(200)
        .expect({ data: { recipesAndCount: { recipes: [], totalCount: 0 } } });
    });
  });

  describe('Multiple recipes', () => {
    beforeEach(() => {
      return Support.createRecipes(app, 3);
    });

    it('should return an array and the correct count (3)', () => {
      return request(app.getHttpServer())
        .post(Support.graphqlEndpoint)
        .send(Support.allRecipesQuery())
        .expect(200)
        .then((data) => {
          expect(data.body.data.recipesAndCount.recipes.length).toEqual(3);
          expect(data.body.data.recipesAndCount.totalCount).toEqual(3);
        });
    });
  });

  describe('Create recipe', () => {
    beforeEach(() => {
      return Support.deleteAllRecipes(app);
    });

    it('should create a recipe without a photo', () => {
      return request(app.getHttpServer())
        .post(Support.graphqlEndpoint)
        .send({
          operationName: 'createRecipe',
          query: `mutation createRecipe($recipe: RecipeInput!) {
            createRecipe(recipe: $recipe) {
              id
              name
              description
              ingredients
              instructions
              cookTime
              difficulty
              photos {
                id
                path
                cloudinaryPublicId
              }
            }
          }`,
          variables: {
            recipe: {
              name: 'Egg muffin',
              description:
                'An exciting new way to eat eggs. Great for breakfasts or simple lunches. This recipe yields 1 serving.',
              ingredients: [
                '2 large eggs',
                '1 small slice of ham',
                'chopped up spinach',
                'grated mozzarella cheese',
              ],
              instructions: [
                'Whisk eggs',
                'Spray the muffin tray with oil',
                'Pour egg mixture into muffin tray',
                'Cut up ham into small pieces and put into the muffin tray with the eggs',
                'Put chopped up spinach into muffin tray with the eggs',
                'Top with cheese',
                'Preheat the oven to 350F',
                'Cook for 20 mins',
                'Take it out of the tray and enjoy!',
              ],
              cookTime: 20,
              difficulty: 1,
              photos: [
                {
                  path: 'https://res.cloudinary.com/dcwjkxleo/image/upload/v1579036167/sfr_unsigned/dxn8zrmi9wymwfrvdx4m.jpg',
                  cloudinaryPublicId: 'sfr_unsigned/dxn8zrmi9wymwfrvdx4m',
                },
              ],
            },
          },
        })
        .expect(200)
        .then((data) => {
          expect(data.body.data.createRecipe.name).toEqual('Egg muffin');
          expect(data.body.data.createRecipe.ingredients).toHaveLength(4);
          expect(data.body.data.createRecipe.photos).toHaveLength(1);
          expect(data.body.data.createRecipe.photos[0].path).not.toEqual(null);
        });
    });

    it('should create a recipe with a photo', () => {
      return request(app.getHttpServer())
        .post(Support.graphqlEndpoint)
        .send({
          operationName: 'createRecipe',
          query: `mutation createRecipe($recipe: RecipeInput!) {
            createRecipe(recipe: $recipe) {
              id
              name
              description
              ingredients
              instructions
              cookTime
              difficulty
              photos {
                id
                path
                cloudinaryPublicId
              }
            }
          }`,
          variables: {
            recipe: {
              name: 'Egg muffin',
              description:
                'An exciting new way to eat eggs. Great for breakfasts or simple lunches. This recipe yields 1 serving.',
              ingredients: [
                '2 large eggs',
                '1 small slice of ham',
                'chopped up spinach',
                'grated mozzarella cheese',
              ],
              instructions: [
                'Whisk eggs',
                'Spray the muffin tray with oil',
                'Pour egg mixture into muffin tray',
                'Cut up ham into small pieces and put into the muffin tray with the eggs',
                'Put chopped up spinach into muffin tray with the eggs',
                'Top with cheese',
                'Preheat the oven to 350F',
                'Cook for 20 mins',
                'Take it out of the tray and enjoy!',
              ],
              cookTime: 20,
              difficulty: 1,
              photos: [],
            },
          },
        })
        .expect(200)
        .then((data) => {
          expect(data.body.data.createRecipe.name).toEqual('Egg muffin');
          expect(data.body.data.createRecipe.ingredients).toHaveLength(4);
          expect(data.body.data.createRecipe.photos).toEqual([]);
        });
    });
  });
});
