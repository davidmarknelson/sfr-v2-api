import { apiUserConstants } from '@api/utilities/constants';
import { apiUserMessageConstants } from '@api/utilities/constants/user-message-constants';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, Matches, NotContains } from 'class-validator';

@InputType()
export class UserInput {
  @Length(
    apiUserConstants.usernameMinLength,
    apiUserConstants.usernameMaxLength,
    {
      message: apiUserMessageConstants.usernameLength,
    },
  )
  @NotContains(' ', { message: apiUserMessageConstants.usernameSpace })
  @Field({
    description: `Must be between ${apiUserConstants.usernameMinLength} and ${apiUserConstants.usernameMaxLength} characters long and not contain a space`,
  })
  username: string;

  @IsEmail({}, { message: 'Email must be an email' })
  @Field()
  email: string;

  @Matches(new RegExp(apiUserConstants.passwordRegex), {
    message: apiUserMessageConstants.passwordRegex,
  })
  @Field({
    description:
      'Must contain a letter, a number, a special character, and be at least 12 characters long',
  })
  password: string;
}
