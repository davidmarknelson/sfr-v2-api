import { EmailArg, IdArg } from '@api/data-access/dto';
import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput } from '../dto';
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
}
