import { Query, Resolver } from '@nestjs/graphql';
import { RecipeType } from '../models';
import { RecipeService } from '../services';

@Resolver(() => RecipeType)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [RecipeType])
  recipes() {
    return this.recipeService.findAll();
  }

  // @ResolveField()
  // async posts(@Parent() author: Author) {
  //   const { id } = author;
  //   return this.postsService.findAll({ authorId: id });
  // }
}
