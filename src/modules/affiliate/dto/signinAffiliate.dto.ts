import { IsString } from 'class-validator';

export class SigninBodyAffiliateDto {
	@IsString()
	username!: string;

	@IsString()
	password!: string;
}

export class SigninResponseAffiliateDto {
	message!: string;
	affiliateToken!: string;
}
