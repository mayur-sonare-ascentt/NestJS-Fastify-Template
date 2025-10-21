import { IsString } from 'class-validator';

export class VerifyJWTBodyUsersDto {
	@IsString()
	token!: string;
}

export class VerifyJWTResponseUsersDto {
	value!: boolean;
}
