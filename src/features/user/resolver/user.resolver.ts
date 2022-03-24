import { DecodedJwt } from '@api/features/auth/decorators';
import { AccessTokenPayloadType } from '@api/features/auth/dto';
import { JwtAuthGuard } from '@api/features/auth/guards';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserType } from '../dto';
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
}
