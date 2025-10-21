// modules/users/dto/signup-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPassBodyAuthDto {
	@IsString()
	@IsNotEmpty({ message: 'Name is required' })
	name!: string;

	@IsEmail({}, { message: 'Invalid email address' })
	email!: string;

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters' })
	password!: string;
}

export class ForgotPassResponseAuthDto {
	message!: string;
}
