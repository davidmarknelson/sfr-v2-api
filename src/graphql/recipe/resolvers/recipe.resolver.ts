import { Query, Resolver } from '@nestjs/graphql';
import { RecipeType } from '../models';

@Resolver(() => RecipeType)
export class RecipeResolver {
  @Query(() => [RecipeType])
  recipes() {
    return [];
  }

  // @ResolveField()
  // async posts(@Parent() author: Author) {
  //   const { id } = author;
  //   return this.postsService.findAll({ authorId: id });
  // }
}
