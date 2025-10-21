import { type AffiliateDocument } from '@/schemas/affiliate.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateBodyAffiliateDto {
	@ApiProperty({
		description: 'Unique username for the affiliate',
		example: 'john_doe',
		type: String,
	})
	@IsString()
	username!: string;

	@ApiProperty({
		description: 'Password for the affiliate (min 6 characters)',
		example: 'securePass123',
		minLength: 6,
		type: String,
	})
	@IsString()
	@MinLength(6)
	password!: string;
}

export class CreateResponseAffiliateDto {
	@ApiProperty({
		description: 'Status message after creating an affiliate',
		example: 'Affiliate created successfully',
	})
	message!: string;

	@ApiProperty({
		description: 'Affiliate document object returned from the database',
		example: {
			username: 'testAffiliate',
			password: 'testPassword',
			total_refers: 0,
			signup_refers: 0,
			success_refers: 0,
			refs: [],
			_id: '68f77aa3a67cf58bd7bbde2b',
			createdAt: '2025-10-21T12:20:51.400Z',
			updatedAt: '2025-10-21T12:20:51.400Z',
			__v: 0,
		},
		type: Object, // you can also use a separate DTO if needed
	})
	affiliate!: AffiliateDocument;
}

//Pick<AffiliateDocument,'_id' | 'username' | 'total_refers' | 'signup_refers' | 'success_refers' | 'refs' | 'createdAt' | 'updatedAt'>; use this to avoid exposing password and other sensitive fields
