import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenType {
  @Field()
  accessToken: string;
}
