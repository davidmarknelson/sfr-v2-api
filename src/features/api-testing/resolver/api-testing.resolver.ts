import { MessageType } from '@api/data-access/dto';
import { DecodedJwt } from '@api/features/auth/decorators';
import { AccessTokenPayloadType } from '@api/features/auth/dto';
import { JwtAuthGuard } from '@api/features/auth/guards';
import { RecipeInput } from '@api/features/recipe/dto';
import { RecipeEntity } from '@api/features/recipe/entity';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { getConnection } from 'typeorm';

@Resolver()
export class ApiTestingResolver {
  @Mutation(() => MessageType)
  async testingResetDatabase(): Promise<MessageType> {
    await getConnection().synchronize(true);
    return { message: 'Database reset' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MessageType)
  async testingCreateRecipes(
    @Args({ name: 'recipes', type: () => [RecipeInput] })
    recipes: RecipeInput[],
    @DecodedJwt() decodedJwt: AccessTokenPayloadType,
  ) {
    const recipesWithUserId = recipes.map((recipe) => {
      return {
        ...recipe,
        creator: {
          id: decodedJwt.sub,
        },
      };
    });
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(RecipeEntity)
      .values(recipesWithUserId)
      .execute();
    return { message: 'Recipes created' };
  }
}
