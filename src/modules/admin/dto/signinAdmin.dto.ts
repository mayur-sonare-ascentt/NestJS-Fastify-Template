import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninAdminDto {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(6)
	password!: string;
}

export class SigninResponseAdminDto {
	message!: string;
	adminToken!: string;
}
