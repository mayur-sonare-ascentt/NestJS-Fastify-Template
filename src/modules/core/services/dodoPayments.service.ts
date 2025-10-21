import { Injectable } from '@nestjs/common';
import DodoPayments from 'dodopayments';
import { ENVService } from '@/modules/core/services/env.service';

@Injectable()
export class DodoPaymentsService {
	public readonly client: DodoPayments;

	constructor(private readonly envService: ENVService) {
		const apiKey =
			this.envService.variables.dodopayments.dodoPaymentsApiKey === 'production'
				? this.envService.variables.dodopayments.dodoPaymentsApiKey
				: this.envService.variables.dodopayments.dodoTestApiKey;

		this.client = new DodoPayments({
			bearerToken: apiKey,
			// environment can be set if needed:
			// environment: this.envService.variables.app.nodeEnv === 'production' ? 'live_mode' : 'test_mode',
		});
	}
}
