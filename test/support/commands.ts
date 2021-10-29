import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class Support {
  static graphqlEndpoint = '/graphql';
  static allRecipesQuery(
    skip = 0,
    take = 9,
  ): {
    operationName: string;
    query: string;
    variables: {
      skip: number;
      take: number;
    };
  } {
    return {
      operationName: 'recipesAndCount',
      query: `query recipesAndCount($skip: Float!, $take: Float!) {
      recipesAndCount(skip: $skip, take: $take) {
        recipes {
          id
          name
          description
          photos {
            id
            path
          }
        }
        totalCount
      }
    }`,
      variables: {
        skip,
        take,
      },
    };
  }

  static async deleteAllRecipes(app: INestApplication): Promise<void> {
    return request(app.getHttpServer())
      .post(this.graphqlEndpoint)
      .send(this.allRecipesQuery())
      .then((res) => {
        res.body.data.recipesAndCount.recipes?.forEach(async (recipe) => {
          await request(app.getHttpServer())
            .post(this.graphqlEndpoint)
            .send({
              operationName: 'deleteRecipe',
              query: `mutation deleteRecipe($id:Float!) {
            deleteRecipe(id:$id) {
              message
            }
          }`,
              variables: {
                id: recipe.id,
              },
            });
        });
      });
  }

  static async createRecipes(
    app: INestApplication,
    numberOfRecipes = 1,
  ): Promise<void> {
    for (let i = 0; i < numberOfRecipes; i++) {
      await request(app.getHttpServer())
        .post(this.graphqlEndpoint)
        .send({
          operationName: 'createRecipe',
          query: `mutation createRecipe($recipe: RecipeInput!) {
            createRecipe(recipe: $recipe) {
              id
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
        });
    }
  }
}
