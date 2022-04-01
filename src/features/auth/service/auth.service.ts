import { LoginArg } from '@api/data-access/dto';
import { PasswordEditInput } from '@api/features/user/dto';
import { UserEntity } from '@api/features/user/entity';
import { UserService } from '@api/features/user/service';
import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { AccessTokenPayloadType, AccessTokenType } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(@Args() loginArg: LoginArg): Promise<UserEntity | null> {
    const user = await this.userService.findOneByEmail({
      email: loginArg.email,
    });
    if (user && (await compare(loginArg.password, user.password))) {
      return user;
    }
    return null;
  }

  async signToken(
    @Args() payload: AccessTokenPayloadType,
  ): Promise<AccessTokenType> {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  createPasswordHash(
    @Args() passwordInput: PasswordEditInput,
  ): Promise<string> {
    return hash(passwordInput.password, 10);
  }
}
