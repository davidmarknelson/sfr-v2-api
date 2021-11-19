import { NodeEnv } from '@api/env.validation';
import { Module } from '@nestjs/common';
import { ApiTestingResolver } from './resolver/api-testing.resolver';

@Module({
  imports: [],
  providers: process.env.NODE_ENV === NodeEnv.Test ? [ApiTestingResolver] : [],
})
export class ApiTestingModule {}
