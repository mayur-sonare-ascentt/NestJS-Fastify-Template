import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AffiliateDocument } from '@/schemas/affiliate.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListQueryAffiliateDto {
	@ApiPropertyOptional({
		description: 'Filter affiliates by username (optional)',
		example: 'john_doe',
		type: String,
	})
	@IsOptional()
	@IsString()
	username?: string;

	@ApiPropertyOptional({
		description: 'Page number for pagination (default: 1)',
		example: 1,
		minimum: 1,
		type: Number,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiPropertyOptional({
		description: 'Number of items per page (default: 10)',
		example: 10,
		minimum: 1,
		type: Number,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number = 10;
}

export class ListResponseAffiliateDto {
	@ApiProperty({
		description: 'Array of affiliate documents',
		example: [
			{
				_id: '67c89e57f9b5bc11f96429d2',
				username: 'affiliateUser123',
				password: 'securePassword123',
				total_refers: 37,
				success_refers: 0,
				refs: [],
				createdAt: '2024-03-06T12:00:00.000Z',
				updatedAt: '2025-09-05T22:15:23.576Z',
				signup_refers: 1,
			},
			{
				signup_refers: 0,
				_id: '67d0804215d032acf011b1f3',
				username: 'affiliate2',
				password: 'hello',
				total_refers: 1,
				success_refers: 0,
				refs: [],
				createdAt: '2025-03-11T18:26:10.938Z',
				updatedAt: '2025-03-11T19:26:58.200Z',
				__v: 0,
			},
		],
		type: Object, // you can also use a separate DTO if needed
	})
	affiliates!: AffiliateDocument[];
}
