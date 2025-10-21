import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ENVService {
	public readonly variables: Configuration;

	constructor(private readonly configService: ConfigService) {
		this.variables = {
			app: {
				name: this.configService.get<string>('app.name'),
				nodeEnv: this.configService.get<string>('app.nodeEnv'),
				port: this.configService.get<number>('app.port'),
			},
			frontend: {
				appUrl: this.configService.get<string>('frontend.appUrl'),
			},
			database: {
				mongoUri: this.configService.get<string>('database.mongoUri'),
			},
			jwt: {
				secret: this.configService.get<string>('jwt.secret'),
				expiresIn: this.configService.get<string>('jwt.expiresIn'),
			},
			email: {
				host: this.configService.get<string>('email.host'),
				user: this.configService.get<string>('email.user'),
				pass: this.configService.get<string>('email.pass'),
				port: this.configService.get<number>('email.port'),
				receiver: this.configService.get<string>('email.receiver'),
				secure: this.configService.get<boolean>('email.secure'),
			},
			storage: {
				provider: this.configService.get<string>('storage.provider'),
				bucket: this.configService.get<string>('storage.bucket'),
				region: this.configService.get<string>('storage.region'),
			},
			logging: {
				level: this.configService.get<string>('logging.level'),
			},
			dodopayments: {
				dodoPaymentsApiKey: this.configService.get<string>('dodopayments.dodoPaymentsApiKey'),
				dodoTestApiKey: this.configService.get<string>('dodopayments.dodoTestApiKey'),
				dodoWebhookKey: this.configService.get<string>('dodopayments.dodoWebhookKey'),
				dodoSubscriptionProductId: this.configService.get<string>('dodopayments.dodoSubscriptionProductId'),
			},
		};
	}
}
