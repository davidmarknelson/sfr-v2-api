import { LoginArg } from '@api/data-access/dto';
import { CurrentUser } from '@api/features/user/decorator';
import { UserInput } from '@api/features/user/dto';
import { UserEntity } from '@api/features/user/entity';
import { UserService } from '@api/features/user/service';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AccessTokenType } from '../dto';
import { LocalAuthGuard } from '../guards';
import { AuthService } from '../service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => AccessTokenType)
  login(
    @CurrentUser() user: UserEntity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args() loginArg: LoginArg,
  ): Promise<AccessTokenType> {
    return this.authService.signToken(user);
  }

  @Mutation(() => AccessTokenType)
  async signup(@Args('user') user: UserInput): Promise<AccessTokenType> {
    const passwordHash = await this.authService.createPasswordHash(user);
    const newUser = await this.userService.createUser({
      ...user,
      password: passwordHash,
    });
    return this.authService.signToken(newUser);
  }
}
