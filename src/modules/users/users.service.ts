import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from '@/schemas/user.schema';
import { TempOrder, TempOrderDocument } from '@/schemas/tempOrder.schema';
import { Affiliate, AffiliateDocument } from '@/schemas/affiliate.schema';
import { DodoPaymentsService } from '@/modules/core/services/dodoPayments.service';
import { DodoCreateBodyUsersDto, DodoCreateResponseUsersDto } from '@/modules/users/dto/dodoCreateUsers.dto';
import { GetEmailUserBodyUsersDto, GetEmailUserResponseUsersDto } from '@/modules/users/dto/getEmailUserUsers.dto';
import { jwtVerify } from 'jose';
import { GetUserBodyUsersDto, GetUserResponseUsersDto } from '@/modules/users/dto/getUserUsers.dto';
import { UtilsService } from '@/modules/core/services/utils.service';
import { VerifyJWTBodyUsersDto, VerifyJWTResponseUsersDto } from '@/modules/users/dto/verifyJWT.dto';
import { VerifyPlanBodyUsersDto, VerifyPlanResponseUsersDto } from '@/modules/users/dto/verifyPlanUsers.dto';
import { ENVService } from '@/modules/core/services/env.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(TempOrder.name) private tempOrderModel: Model<TempOrderDocument>,
		@InjectModel(Affiliate.name) private affiliateModel: Model<AffiliateDocument>,
		private readonly dodoService: DodoPaymentsService,
		private readonly envService: ENVService,
		private readonly utilsService: UtilsService,
	) {}

	async dodoCreate(body: DodoCreateBodyUsersDto): Promise<DodoCreateResponseUsersDto> {
		try {
			const { name, email, city, country, state, street, zipcode, affiliate } = body;

			const productId = this.envService.variables.dodopayments.dodoSubscriptionProductId;

			if (!productId) {
				throw new InternalServerErrorException('ProductId is not set in environment variables');
			}

			const code = uuidv4();

			const subscription = await this.dodoService.client.subscriptions.create({
				billing: { city, country, state, street, zipcode },
				customer: { email, name },
				payment_link: true,
				return_url: `${this.envService.variables.frontend.appUrl}/payment-success`,
				product_id: productId,
				quantity: 1,
			});

			await this.tempOrderModel.findOneAndDelete({ email });

			const tempOrder = new TempOrder({
				email,
				code,
				paymentId: subscription.payment_id,
				affiliate: affiliate || null,
			});

			await tempOrder.save();

			return { paymentLink: subscription.payment_link };
		} catch (err) {
			console.error('Payment link creation failed', err);
			throw new InternalServerErrorException(err instanceof Error ? err.message : 'An unknown error occurred');
		}
	}

	async getEmailUser(body: GetEmailUserBodyUsersDto): Promise<GetEmailUserResponseUsersDto> {
		try {
			const { token } = body;
			const JWT_SECRET_KEY = new TextEncoder().encode(this.envService.variables.jwt.secret);

			const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
				algorithms: ['HS256'],
			});

			if (typeof payload.email === 'string') {
				return { email: payload.email };
			} else {
				throw new BadRequestException('Email not found in token');
			}
		} catch (err) {
			console.error('Invalid or expired token:', err);
			if (err instanceof BadRequestException) throw err;
			throw new UnauthorizedException('Invalid or expired token');
		}
	}

	async getUser(body: GetUserBodyUsersDto): Promise<GetUserResponseUsersDto> {
		const { token } = body;

		if (!token) throw new BadRequestException('Token missing');

		const email = await this.utilsService.getEmail(token);

		if (!email) throw new UnauthorizedException('Invalid token');

		const user = await this.userModel.findOne({ email });
		if (!user) throw new NotFoundException('User not found');

		return {
			email: user.email,
			plan: user.plan,
			firstName: user.firstName,
			lastName: user.lastName,
		};
	}

	async logout(res: FastifyReply): Promise<void> {
		await res
			.setCookie('token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
				expires: new Date(0),
			})
			.status(200)
			.send({ message: 'Logged out' });
	}

	async verifyJWT(body: VerifyJWTBodyUsersDto): Promise<VerifyJWTResponseUsersDto> {
		const { token } = body;

		if (!token) throw new BadRequestException('Token missing');

		const email = await this.utilsService.getEmail(token);

		if (!email) throw new UnauthorizedException('Invalid token');

		const user = await this.userModel.findOne({ email });
		if (!user) throw new NotFoundException('User not found');

		return { value: true };
	}

	async verifyPlan(body: VerifyPlanBodyUsersDto): Promise<VerifyPlanResponseUsersDto> {
		const { token } = body;

		if (!token) throw new BadRequestException('Token missing');

		const email = await this.utilsService.getEmail(token);
		if (!email) throw new UnauthorizedException('Invalid token');

		const user = await this.userModel.findOne({ email });
		if (!user) throw new NotFoundException('User not found');

		const hasValidPlan = user.plan === 'premium' || user.plan === 'enterprise';

		return {
			success: true,
			plan: user.plan,
			valid: hasValidPlan,
		};
	}
}
