import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length, Matches, NotContains } from 'class-validator';

@InputType()
export class UserInput {
  @Length(5, 25, {
    message: 'Username must be between 5 and 25 characters long',
  })
  @NotContains(' ', { message: 'Username must not contain a space' })
  @Field({
    description:
      'Must be between 5 and 25 characters long and not contain a space',
  })
  username: string;

  @IsEmail({}, { message: 'Email must be an email' })
  @Field()
  email: string;

  @Matches(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$+%^&*-]).{12,}$/, {
    message:
      'Password must contain a letter, a number, a special character, and be at least 12 characters long',
  })
  @Field({
    description:
      'Must contain a letter, a number, a special character, and be at least 12 characters long',
  })
  password: string;
}
