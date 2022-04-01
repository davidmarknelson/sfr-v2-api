import { PsqlError } from '@api/data-access/constants';
import { LoginArg, MessageType } from '@api/data-access/dto';
import { DecodedJwt } from '@api/features/auth/decorators';
import { PasswordEditInput, UserInput } from '@api/features/user/dto';
import { UserService } from '@api/features/user/service';
import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessTokenPayloadType, AccessTokenType } from '../dto';
import { JwtAuthGuard } from '../guards';
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
    return this.authService.signToken({
      username: user.username,
      sub: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AccessTokenType)
  async refreshToken(
    @DecodedJwt() decodedJwt: AccessTokenPayloadType,
  ): Promise<AccessTokenType> {
    return this.authService.signToken(decodedJwt);
  }

  @Mutation(() => AccessTokenType)
  async signup(@Args('user') user: UserInput): Promise<AccessTokenType> {
    try {
      const passwordHash = await this.authService.createPasswordHash({
        password: user.password,
      });
      const newUser = await this.userService.create({
        ...user,
        password: passwordHash,
      });
      return this.authService.signToken({
        username: newUser.username,
        sub: newUser.id,
      });
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MessageType)
  async updatePassword(
    @DecodedJwt() decodedJwt: AccessTokenPayloadType,
    @Args('password') passwordInput: PasswordEditInput,
  ): Promise<MessageType> {
    const passwordHash = await this.authService.createPasswordHash(
      passwordInput,
    );
    return this.userService.updatePassword(
      { id: decodedJwt.sub },
      { password: passwordHash },
    );
  }
}
