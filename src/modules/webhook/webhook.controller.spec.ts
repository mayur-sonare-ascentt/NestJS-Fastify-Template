import { Test, TestingModule } from '@nestjs/testing';
import { CoreController } from '@/modules/core/core.controller';
import { CoreService } from '@/modules/core/core.service';

describe('CoreController', () => {
	let coreController: CoreController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [CoreController],
			providers: [CoreService],
		}).compile();

		coreController = app.get<CoreController>(CoreController);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(coreController.getHello()).toBe('Hello World!');
		});
	});
});
