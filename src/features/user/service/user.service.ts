import { EmailArg, IdArg, MessageType } from '@api/data-access/dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordEditInput, ProfileEditInput, UserInput } from '../dto';
import { UserEntity } from '../entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOneByEmail(@Args() emailArg: EmailArg): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: emailArg,
    });
  }

  findOneById(@Args() idArg: IdArg): Promise<UserEntity> {
    return this.userRepository.findOne(idArg, {
      relations: ['recipes'],
    });
  }

  create(@Args('user') user: UserInput): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async editProfile(
    @Args() idArg: IdArg,
    @Args() profileEdit: ProfileEditInput,
  ): Promise<UserEntity> {
    const { username, email } = profileEdit;

    const foundUsername = await this.userRepository.findOne({ username });

    if (foundUsername && foundUsername.id !== idArg.id) {
      throw new BadRequestException('That username is already taken');
    }

    const foundEmail = await this.userRepository.findOne({ email });

    if (foundEmail && foundEmail.id !== idArg.id) {
      throw new BadRequestException('That email is already in user');
    }

    await this.userRepository.save({
      id: idArg.id,
      username,
      email,
    });

    return this.userRepository.findOne(idArg);
  }

  async updatePassword(
    @Args() idArg: IdArg,
    @Args() passwordArg: PasswordEditInput,
  ): Promise<MessageType> {
    await this.userRepository.save({
      id: idArg.id,
      password: passwordArg.password,
    });

    return { message: 'Password updated' };
  }
}
