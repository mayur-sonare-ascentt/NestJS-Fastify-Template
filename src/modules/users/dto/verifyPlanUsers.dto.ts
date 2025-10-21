import { IsString } from 'class-validator';

export class VerifyPlanBodyUsersDto {
	@IsString()
	token!: string;
}

export class VerifyPlanResponseUsersDto {
	success!: boolean;
	plan!: string;
	valid!: boolean;
}
