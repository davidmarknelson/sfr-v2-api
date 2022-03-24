import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity';
import { UserResolver } from './resolver/user.resolver';
import { UserService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserEntity, UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
