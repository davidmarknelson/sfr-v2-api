import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenPayloadType {
  @Field()
  username: string;

  @Field({ description: 'User id' })
  sub: number;
}
