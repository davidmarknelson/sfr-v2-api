import { PsqlError } from '@api/data-access/constants';
import { LoginArg } from '@api/data-access/dto';
import { UserInput } from '@api/features/user/dto';
import { UserService } from '@api/features/user/service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessTokenType } from '../dto';
import { AuthService } from '../service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Query(() => AccessTokenType)
  async login(@Args() loginArg: LoginArg): Promise<AccessTokenType> {
    const user = await this.authService.validateUser(loginArg);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return this.authService.signToken(user);
  }

  @Mutation(() => AccessTokenType)
  async signup(@Args('user') user: UserInput): Promise<AccessTokenType> {
    try {
      const passwordHash = await this.authService.createPasswordHash(user);
      const newUser = await this.userService.create({
        ...user,
        password: passwordHash,
      });
      return this.authService.signToken(newUser);
    } catch (err) {
      if (
        err.code === PsqlError.UNIQUE &&
        (err.detail.includes('email') || err.detail.includes('username'))
      ) {
        throw new BadRequestException(
          'An account with this email or username already exists',
        );
      }
    }
  }
}
