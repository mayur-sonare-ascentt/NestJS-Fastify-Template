import { IsString } from 'class-validator';

export class GetDataBodyAffiliateDto {
	@IsString()
	username!: string;
}

export class GetDataResponseAffiliateDto {
	total_refers!: number;
	success_refers!: number;
	signup_refers!: number;
}
