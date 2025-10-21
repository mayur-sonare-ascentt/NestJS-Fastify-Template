import { IsEmail, IsString } from 'class-validator';

export class VerifyQueryAuthDto {
	@IsEmail()
	email!: string;

	@IsString()
	token!: string;
}

export class VerifyResponseAuthDto {
	success!: boolean;
	message!: string;
}
