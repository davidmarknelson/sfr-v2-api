import { LoginArg } from '@api/data-access/dto';
import { CurrentUser } from '@api/features/user/decorator';
import { UserInput } from '@api/features/user/dto';
import { UserEntity } from '@api/features/user/entity';
import { UserService } from '@api/features/user/service';
import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { AccessTokenType } from '../dto';

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

  async signToken(@CurrentUser() user: UserEntity): Promise<AccessTokenType> {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  createPasswordHash(@Args('user') user: UserInput): Promise<string> {
    return hash(user.password, 10);
  }
}
