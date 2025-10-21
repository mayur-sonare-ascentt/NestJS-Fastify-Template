import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Affiliate, AffiliateDocument } from '@/schemas/affiliate.schema';
import { ENVService } from '@/modules/core/services/env.service';
import { AddRefBodyAffiliateDto, AddRefResponseAffiliateDto } from '@/modules/affiliate/dto/addRefAffiliate.dto';
import { jwtVerify, SignJWT } from 'jose';
import {
	CheckValidityBodyAffiliateDto,
	CheckValidityResponseAffiliateDto,
} from '@/modules/affiliate/dto/checkValidityAffiliate.dto';
import { GetDataBodyAffiliateDto, GetDataResponseAffiliateDto } from '@/modules/affiliate/dto/getDataAffiliate.dto';
import { SigninBodyAffiliateDto, SigninResponseAffiliateDto } from '@/modules/affiliate/dto/signinAffiliate.dto';
import { ListQueryAffiliateDto, ListResponseAffiliateDto } from '@/modules/affiliate/dto/listAffiliate.dto';
import { CreateBodyAffiliateDto, CreateResponseAffiliateDto } from '@/modules/affiliate/dto/createAffiliate.dto';

@Injectable()
export class AffiliateService {
	constructor(
		@InjectModel(Affiliate.name) private affiliateModel: Model<AffiliateDocument>,
		private readonly envService: ENVService,
	) {}

	async addRef(body: AddRefBodyAffiliateDto): Promise<AddRefResponseAffiliateDto> {
		try {
			const { referrer } = body;

			if (!referrer) {
				throw new BadRequestException('Username is required');
			}

			const updatedAffiliate = await this.affiliateModel.findOneAndUpdate(
				{ username: referrer },
				{ $inc: { total_refers: 1 } },
				{ new: true },
			);

			if (!updatedAffiliate) {
				throw new NotFoundException('Affiliate not found');
			}

			return {
				message: 'Total refers increased',
				data: updatedAffiliate,
			};
		} catch (error) {
			console.error('Error updating total_refers:', error);
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async checkValidity(body: CheckValidityBodyAffiliateDto): Promise<CheckValidityResponseAffiliateDto> {
		try {
			const { username, affiliateToken } = body;

			if (!affiliateToken) {
				throw new BadRequestException('Invalid or missing token');
			}

			const affiliate = await this.affiliateModel.findOne({ username });
			if (!affiliate) {
				throw new NotFoundException('Affiliate not found');
			}

			const jwtSecret = this.envService.variables.jwt.secret;
			if (!jwtSecret) {
				throw new InternalServerErrorException('JWT_SECRET not set in environment variables');
			}

			const SECRET_KEY = new TextEncoder().encode(jwtSecret);
			const { payload } = await jwtVerify(affiliateToken, SECRET_KEY);

			const verified = payload.username === username;
			if (verified) {
				return { success: 'Verified' };
			}

			throw new BadRequestException('Verification failed');
		} catch (error) {
			console.error('Verification Error:', error);
			if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async getData(body: GetDataBodyAffiliateDto): Promise<GetDataResponseAffiliateDto> {
		try {
			const { username } = body;

			const affiliate = await this.affiliateModel
				.findOne({ username })
				.select('total_refers success_refers signup_refers');

			if (!affiliate) {
				throw new BadRequestException('Invalid');
			}

			return {
				total_refers: affiliate.total_refers,
				success_refers: affiliate.success_refers,
				signup_refers: affiliate.signup_refers,
			};
		} catch (error) {
			console.error('Verification Error:', error);
			if (error instanceof BadRequestException) throw error;
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async signin(body: SigninBodyAffiliateDto): Promise<SigninResponseAffiliateDto> {
		try {
			const { username, password } = body;

			if (!username || !password) {
				throw new BadRequestException('Username and password are required');
			}

			const affiliate = await this.affiliateModel.findOne({ username });
			if (!affiliate) {
				throw new UnauthorizedException('Invalid affiliate credentials');
			}

			const isMatch = password === affiliate.password;
			if (!isMatch) {
				throw new UnauthorizedException('Invalid affiliate credentials');
			}

			const jwtSecret = this.envService.variables.jwt.secret;
			const jwtExpiration = this.envService.variables.jwt.expiresIn || '3600'; // fallback

			const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecret);

			const token = await new SignJWT({
				adminId: (affiliate._id as { toString: () => string }).toString(),
				username: affiliate.username,
			})
				.setProtectedHeader({ alg: 'HS256' })
				.setExpirationTime(`${jwtExpiration}s`)
				.sign(JWT_SECRET_KEY);

			return {
				message: 'Affiliate login successful',
				affiliateToken: token,
			};
		} catch (error) {
			console.error('Error during affiliate login:', error);
			if (error instanceof BadRequestException || error instanceof UnauthorizedException) throw error;
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async listAffiliates(query: ListQueryAffiliateDto): Promise<ListResponseAffiliateDto> {
		const { username, page = 1, limit = 10 } = query;
		const filter: Record<string, any> = {};

		if (username) filter.username = { $regex: username, $options: 'i' };

		try {
			const affiliates = await this.affiliateModel
				.find(filter)
				.skip((page - 1) * limit)
				.limit(limit)
				.exec();

			if (!affiliates || affiliates.length === 0) {
				throw new NotFoundException('No affiliates found');
			}

			return {
				affiliates: affiliates,
			};
		} catch (error) {
			console.error('Error fetching affiliates:', error);

			if (error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async createAffiliate(body: CreateBodyAffiliateDto): Promise<CreateResponseAffiliateDto> {
		const { username, password } = body;

		if (!username || !password) {
			throw new BadRequestException('Username and password are required');
		}

		try {
			const newAffiliate = new this.affiliateModel({ username, password });
			await newAffiliate.save();

			return {
				message: 'Affiliate created successfully',
				affiliate: newAffiliate,
			};
		} catch (error) {
			console.error('Error creating affiliate:', error);
			throw new InternalServerErrorException('Internal Server Error');
		}
	}
}
