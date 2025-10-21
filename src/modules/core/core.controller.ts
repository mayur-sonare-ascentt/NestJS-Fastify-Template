import { Controller, Get } from '@nestjs/common';
import { CoreService } from '@/modules/core/core.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Core')
@Controller()
export class CoreController {
	constructor(private readonly coreService: CoreService) {}

	@Get()
	getHello(): string {
		return this.coreService.getHello();
	}

	@Get('health')
	getHealth(): string {
		return this.coreService.getHealth();
	}
}
