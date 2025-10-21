import { IsString } from 'class-validator';

export class CheckValidityBodyAffiliateDto {
	@IsString()
	username!: string;

	@IsString()
	affiliateToken!: string;
}

export class CheckValidityResponseAffiliateDto {
	success?: string;
	error?: string;
}
