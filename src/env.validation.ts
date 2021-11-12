import { plainToClass } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, validateSync } from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsNumber()
  PORT: number;

  CLIENT_URL: string;

  TYPEORM_HOST: string;

  @IsNumber()
  TYPEORM_PORT: number;

  TYPEORM_USERNAME: string;

  TYPEORM_PASSWORD: string;

  TYPEORM_DATABASE: string;

  @IsBoolean()
  TYPEORM_SYNCRONIZE: boolean;

  JWT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
