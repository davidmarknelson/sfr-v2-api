import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity';
import { UserService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserEntity, UserService],
  exports: [UserService],
})
export class UserModule {}
