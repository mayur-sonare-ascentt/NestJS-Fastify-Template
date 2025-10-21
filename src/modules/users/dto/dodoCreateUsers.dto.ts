import { IsString, IsEmail, IsOptional } from 'class-validator';
import { type CountryCode } from 'dodopayments/resources/misc.js';

export class DodoCreateBodyUsersDto {
	@IsString()
	name!: string;

	@IsEmail()
	email!: string;

	@IsString()
	city!: string;

	@IsString()
	country!: CountryCode;

	@IsString()
	state!: string;

	@IsString()
	street!: string;

	@IsString()
	zipcode!: string;

	@IsOptional()
	@IsString()
	affiliate?: string;
}

export class DodoCreateResponseUsersDto {
	paymentLink!: string | null | undefined;
}
