import { IsString } from 'class-validator';

export class GetUserBodyUsersDto {
	@IsString()
	token!: string;
}

export class GetUserResponseUsersDto {
	email!: string;
	plan!: string;
	firstName!: string;
	lastName!: string;
}
