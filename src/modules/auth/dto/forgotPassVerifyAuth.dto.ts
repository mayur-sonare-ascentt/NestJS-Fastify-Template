import { IsEmail, IsNumberString } from 'class-validator';

export class ForgotPassVerifyBodyAuthDto {
	@IsEmail()
	email!: string;

	@IsNumberString()
	code!: string;
}

export class ForgotPassVerifyResponseAuthDto {
	message!: string;
}
