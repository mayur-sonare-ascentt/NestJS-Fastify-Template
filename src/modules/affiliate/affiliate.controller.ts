import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AffiliateService } from '@/modules/affiliate/affiliate.service';
import { AddRefBodyAffiliateDto, AddRefResponseAffiliateDto } from '@/modules/affiliate/dto/addRefAffiliate.dto';
import {
	CheckValidityBodyAffiliateDto,
	CheckValidityResponseAffiliateDto,
} from '@/modules/affiliate/dto/checkValidityAffiliate.dto';
import { GetDataBodyAffiliateDto, GetDataResponseAffiliateDto } from '@/modules/affiliate/dto/getDataAffiliate.dto';
import { SigninBodyAffiliateDto, SigninResponseAffiliateDto } from '@/modules/affiliate/dto/signinAffiliate.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBodyAffiliateDto, CreateResponseAffiliateDto } from '@/modules/affiliate/dto/createAffiliate.dto';
import { ListQueryAffiliateDto, ListResponseAffiliateDto } from '@/modules/affiliate/dto/listAffiliate.dto';

@ApiTags('Affiliate')
@Controller('affiliate')
export class AffiliateController {
	constructor(private readonly affiliateService: AffiliateService) {}

	@Post('add-ref')
	@ApiBody({
		type: AddRefBodyAffiliateDto,
		description: 'Provide the referrer username to increment their total_refers count.',
		examples: {
			default: {
				summary: 'Example request',
				value: { referrer: 'john_doe' },
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Total refers increased successfully',
		type: AddRefResponseAffiliateDto,
	})
	@ApiResponse({ status: 400, description: 'Bad Request - Missing or invalid referrer' })
	@ApiResponse({ status: 404, description: 'Affiliate not found' })
	@ApiResponse({ status: 500, description: 'Internal Server Error' })
	addRef(@Body() body: AddRefBodyAffiliateDto): Promise<AddRefResponseAffiliateDto> {
		return this.affiliateService.addRef(body);
	}

	@Post('check-validity')
	checkValidity(@Body() body: CheckValidityBodyAffiliateDto): Promise<CheckValidityResponseAffiliateDto> {
		return this.affiliateService.checkValidity(body);
	}

	@Post('get-data')
	getData(@Body() body: GetDataBodyAffiliateDto): Promise<GetDataResponseAffiliateDto> {
		return this.affiliateService.getData(body);
	}

	@Post('signin')
	signin(@Body() body: SigninBodyAffiliateDto): Promise<SigninResponseAffiliateDto> {
		return this.affiliateService.signin(body);
	}

	@Post('create')
	@ApiBody({ type: CreateBodyAffiliateDto })
	@ApiResponse({
		status: 201,
		description: 'User created successfully',
		type: CreateResponseAffiliateDto,
	})
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 500, description: 'Internal Server Error' })
	async createAffiliate(@Body() body: CreateBodyAffiliateDto): Promise<CreateResponseAffiliateDto> {
		return this.affiliateService.createAffiliate(body);
	}

	@Get('list')
	@ApiOperation({
		summary: 'Get list of affiliates',
		description: 'Fetches a paginated list of affiliates, optionally filtered by username (case-insensitive).',
	})
	@ApiQuery({
		name: 'username',
		required: false,
		description: 'Filter affiliates by username (case-insensitive).',
		example: 'john',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Page number for pagination (default: 1).',
		example: 1,
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: 'Number of affiliates per page (default: 10).',
		example: 10,
	})
	@ApiResponse({
		status: 200,
		description: 'List of affiliates retrieved successfully.',
		type: ListResponseAffiliateDto,
	})
	@ApiResponse({ status: 404, description: 'No affiliates found.' })
	@ApiResponse({ status: 500, description: 'Internal Server Error.' })
	async listAffiliates(@Query() query: ListQueryAffiliateDto): Promise<ListResponseAffiliateDto> {
		return this.affiliateService.listAffiliates(query);
	}
}
