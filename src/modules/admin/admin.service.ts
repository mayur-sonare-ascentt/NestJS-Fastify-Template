import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { format, addDays, subMonths } from 'date-fns';
import { Model } from 'mongoose';
import { Affiliate, AffiliateDocument } from '@/schemas/affiliate.schema';
import { SignJWT } from 'jose';
import { Admin, AdminDocument } from '@/schemas/admin.schema';
import { SigninAdminDto, SigninResponseAdminDto } from '@/modules/admin/dto/signinAdmin.dto';
import { ENVService } from '@/modules/core/services/env.service';
import { Last3MonthsResponseAdminDto } from '@/modules/admin/dto/last3MonthsAdmin.dto';
import { Visit, VisitDocument } from '@/schemas/visit.schema';

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
		@InjectModel(Affiliate.name) private affiliateModel: Model<AffiliateDocument>,
		@InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
		private readonly envService: ENVService,
	) {}

	async signin(body: SigninAdminDto): Promise<SigninResponseAdminDto> {
		const { email, password } = body;
		const JWT_SECRET_KEY = new TextEncoder().encode(this.envService.variables.jwt.secret);

		if (!email || !password) {
			throw new BadRequestException('Email and password are required');
		}

		try {
			const admin = await this.adminModel.findOne({ email }).exec();
			if (!admin) {
				throw new UnauthorizedException('Invalid admin credentials');
			}

			// Normally use bcrypt, but keeping logic same as given
			const isMatch = password === admin.password;
			if (!isMatch) {
				throw new UnauthorizedException('Invalid admin credentials');
			}

			const token = await new SignJWT({
				adminId: (admin._id as { toString: () => string }).toString(),
				email: admin.email,
			})
				.setProtectedHeader({ alg: 'HS256' })
				.setExpirationTime(`${this.envService.variables.jwt.expiresIn}s`)
				.sign(JWT_SECRET_KEY);

			return {
				message: 'Admin login successful',
				adminToken: token,
			};
		} catch (error) {
			console.error('Error during admin login:', error);
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async getStatsLast3Month(): Promise<Last3MonthsResponseAdminDto> {
		const endDate = new Date();
		const startDate = subMonths(endDate, 3);

		const results: VisitAggregateResult[] = await this.visitModel.aggregate([
			{
				$match: {
					page: '/',
					visitTime: { $gte: startDate, $lte: endDate },
				},
			},
			{
				$group: {
					_id: {
						year: { $year: '$visitTime' },
						month: { $month: '$visitTime' },
						day: { $dayOfMonth: '$visitTime' },
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
		]);

		// Prepare dates
		const chartData: { date: string; visits: number }[] = [];
		let currentDate = startDate;

		while (currentDate <= endDate) {
			chartData.push({ date: format(currentDate, 'yyyy-MM-dd'), visits: 0 });
			currentDate = addDays(currentDate, 1);
		}

		// Fill chart data
		results.forEach(({ _id, count }) => {
			const date = format(new Date(_id.year, _id.month - 1, _id.day), 'yyyy-MM-dd');
			const index = chartData.findIndex((item) => item.date === date);
			if (index !== -1) chartData[index].visits = count;
		});

		// Calculate trending
		const lastIndex = chartData.length - 1;
		const prevIndex = lastIndex - 1;
		const currentDayVisits = chartData[lastIndex]?.visits || 0;
		const previousDayVisits = chartData[prevIndex]?.visits || 0;

		let trending = 0;
		let up = false;

		if (previousDayVisits > 0) {
			trending = ((currentDayVisits - previousDayVisits) / previousDayVisits) * 100;
			up = trending > 0;
		}

		return {
			startDate: format(startDate, 'yyyy-MM-dd'),
			endDate: format(endDate, 'yyyy-MM-dd'),
			chartData,
			trending: parseFloat(trending.toFixed(2)),
			up,
		};
	}
}
