import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgotPassResetBodyAuthDto {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(6)
	password!: string;
}

export class ForgotPassResetResponseAuthDto {
	message!: string;
}
