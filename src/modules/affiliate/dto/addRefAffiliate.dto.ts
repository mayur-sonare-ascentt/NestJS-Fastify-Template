import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { type AffiliateDocument } from '@/schemas/affiliate.schema';

export class AddRefBodyAffiliateDto {
	@ApiProperty({
		description: 'Referrer username or ID to add as a referral source',
		example: 'john_doe_123',
		type: String,
	})
	@IsString()
	referrer!: string;
}

export class AddRefResponseAffiliateDto {
	@ApiProperty({
		description: 'Status message of the operation',
		example: 'Total refers increased',
	})
	message!: string;

	@ApiProperty({
		description: 'Updated affiliate document after adding the referral',
		type: Object, // you can also use a DTO reference if you have one
		example: {
			_id: '67c89e57f9b5bc11f96429d2',
			username: 'affiliateUser123',
			password: 'securePassword123',
			total_refers: 38,
			success_refers: 0,
			refs: [],
			createdAt: '2024-03-06T12:00:00.000Z',
			updatedAt: '2025-10-21T13:40:24.469Z',
			signup_refers: 1,
		},
	})
	data!: AffiliateDocument;
}
