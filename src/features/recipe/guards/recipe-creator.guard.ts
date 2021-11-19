import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RecipeService } from '../service';

@Injectable()
export class RecipeCreatorGuard implements CanActivate {
  constructor(private recipeService: RecipeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const recipeId: number = ctx.getArgs().id;
    const decodedJwtUserId: number = ctx.getContext().req.user.sub;
    const recipe = await this.recipeService.findOneById({ id: recipeId });
    return recipe.creator.id === decodedJwtUserId;
  }
}
