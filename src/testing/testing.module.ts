import { Module } from '@nestjs/common';
import { TestingResolver } from './testing.resolver';

@Module({
  providers: [TestingResolver],
})
export class ApiTestingModule {}
