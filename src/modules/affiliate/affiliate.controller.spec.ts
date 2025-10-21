import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Affiliate, AffiliateType } from '@/schemas/affiliate.schema';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Visit } from '@/schemas/visit.schema';
import { Admin } from '@/schemas/admin.schema';
import { ENVService } from '@/modules/core/services/env.service';
import { UtilsService } from '@/modules/core/services/utils.service';
import { AffiliateService } from '@/modules/affiliate/affiliate.service';

describe('AffiliateController', () => {
	let affiliateService: AffiliateService;
	let mockAffiliateModel: {
		find: jest.Mock;
		skip: jest.Mock;
		limit: jest.Mock;
		exec: jest.Mock;
	};

	const affiliateArray: Partial<AffiliateType>[] = [
		{
			username: 'john',
			password: 'pass123',
			success_refers: 2,
			total_refers: 0,
			signup_refers: 0,
			refs: [],
		},
		{
			username: 'jane',
			password: 'pass456',
			success_refers: 5,
			total_refers: 0,
			signup_refers: 0,
			refs: [],
		},
	];

	beforeEach(async () => {
		mockAffiliateModel = {
			find: jest.fn().mockReturnThis(),
			skip: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			exec: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AffiliateService,
				{ provide: getModelToken(Visit.name), useValue: {} }, // mock Visit model
				{ provide: getModelToken(Admin.name), useValue: {} }, // mock Admin model
				{ provide: getModelToken(Affiliate.name), useValue: mockAffiliateModel },
				{ provide: ENVService, useValue: { get: jest.fn() } },
				{ provide: UtilsService, useValue: { someMethod: jest.fn() } },
			],
		}).compile();

		affiliateService = module.get<AffiliateService>(AffiliateService);
	});

	describe('GET /admin/list', () => {
		it('should return paginated affiliates', async () => {
			mockAffiliateModel.exec.mockResolvedValueOnce(affiliateArray);

			const query = { username: 'j', page: 1, limit: 10 };
			const result = await affiliateService.listAffiliates(query);

			expect(mockAffiliateModel.find).toHaveBeenCalledWith({
				username: { $regex: 'j', $options: 'i' },
			});
			expect(result.affiliates).toEqual(affiliateArray);
		});

		it('should throw NotFoundException if no affiliates found', async () => {
			mockAffiliateModel.exec.mockResolvedValueOnce([]);

			await expect(affiliateService.listAffiliates({ username: 'nonexistent' })).rejects.toThrow(NotFoundException);
		});

		it('should throw InternalServerErrorException on model failure', async () => {
			mockAffiliateModel.exec.mockRejectedValueOnce(new Error('DB error'));

			await expect(affiliateService.listAffiliates({})).rejects.toThrow(InternalServerErrorException);
		});
	});
});
