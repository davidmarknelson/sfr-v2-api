import { apiUserConstants } from '@api/utilities/constants';
import { apiUserMessageConstants } from '@api/utilities/constants/user-message-constants';
import { Field, InputType } from '@nestjs/graphql';
import { Matches } from 'class-validator';

@InputType()
export class PasswordEditInput {
  @Matches(new RegExp(apiUserConstants.passwordRegex), {
    message: apiUserMessageConstants.passwordRegex,
  })
  @Field({
    description:
      'Must contain a letter, a number, a special character, and be at least 12 characters long',
  })
  password: string;
}
