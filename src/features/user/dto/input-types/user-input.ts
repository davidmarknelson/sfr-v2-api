import { userConstants } from '@api/utilities/constants';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, Matches, NotContains } from 'class-validator';

@InputType()
export class UserInput {
  @Length(userConstants.usernameMinLength, userConstants.usernameMaxLength, {
    message: `Username must be between ${userConstants.usernameMinLength} and ${userConstants.usernameMaxLength} characters long`,
  })
  @NotContains(' ', { message: 'Username must not contain a space' })
  @Field({
    description: `Must be between ${userConstants.usernameMinLength} and ${userConstants.usernameMaxLength} characters long and not contain a space`,
  })
  username: string;

  @IsEmail({}, { message: 'Email must be an email' })
  @Field()
  email: string;

  @Matches(new RegExp(userConstants.passwordRegex), {
    message:
      'Password must contain a letter, a number, a special character, and be at least 12 characters long',
  })
  @Field({
    description:
      'Must contain a letter, a number, a special character, and be at least 12 characters long',
  })
  password: string;
}
