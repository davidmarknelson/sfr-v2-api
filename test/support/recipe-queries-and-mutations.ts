import { RecipeEditInput, RecipeInput } from '@api/features/recipe/dto';

export class RecipeQueriesAndMutations {
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
  static recipeQuery(name: string): {
    operationName: string;
    query: string;
    variables: {
      name: string;
    };
  } {
    return {
      operationName: 'recipe',
      query: `query recipe($name: String!) {
      recipe(name: $name) {
        cookTime
        description
        difficulty
        id
        ingredients
        instructions
        name
        photos {
          id
          path
          cloudinaryPublicId
        }
      }
    }`,
      variables: {
        name,
      },
    };
  }
  static recipeCreateMutation(recipe: RecipeInput): {
    operationName: string;
    query: string;
    variables: {
      recipe: RecipeInput;
    };
  } {
    return {
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
        recipe,
      },
    };
  }
  static recipeEditMutation(recipe: RecipeEditInput): {
    operationName: string;
    query: string;
    variables: {
      recipe: RecipeEditInput;
    };
  } {
    return {
      operationName: 'editRecipe',
      query: `mutation editRecipe($recipe: RecipeEditInput!) {
     editRecipe(recipe: $recipe) {
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
        recipe,
      },
    };
  }
}
