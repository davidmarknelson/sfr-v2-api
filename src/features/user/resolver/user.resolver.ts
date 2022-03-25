import { DecodedJwt } from '@api/features/auth/decorators';
import { AccessTokenPayloadType } from '@api/features/auth/dto';
import { JwtAuthGuard } from '@api/features/auth/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileEditInput, UserType } from '../dto';
import { UserService } from '../service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserType)
  async profile(
    @DecodedJwt() decodedJwt: AccessTokenPayloadType,
  ): Promise<UserType> {
    return this.userService.findOneById({ id: decodedJwt.sub });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserType)
  async editProfile(
    @DecodedJwt() decodedJwt: AccessTokenPayloadType,
    @Args('profile') profileEdit: ProfileEditInput,
  ): Promise<UserType> {
    return this.userService.editProfile({ id: decodedJwt.sub }, profileEdit);
  }
}
