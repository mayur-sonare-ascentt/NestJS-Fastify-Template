import { IsString } from 'class-validator';

export class GetEmailUserBodyUsersDto {
	@IsString()
	token!: string;
}

export class GetEmailUserResponseUsersDto {
	email!: string;
}
