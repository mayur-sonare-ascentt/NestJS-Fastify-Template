interface Configuration {
	app: {
		name: string | undefined;
		nodeEnv: string | undefined;
		port: number | undefined;
	};
	frontend: {
		appUrl: string | undefined;
	};
	database: {
		mongoUri: string | undefined;
	};
	jwt: {
		secret: string | undefined;
		expiresIn: string | undefined;
	};
	email: {
		host: string | undefined;
		user: string | undefined;
		pass: string | undefined;
		port: number | undefined;
		receiver: string | undefined;
		secure: boolean | undefined;
	};
	storage: {
		provider: string | undefined;
		bucket: string | undefined;
		region: string | undefined;
	};
	logging: {
		level: string | undefined;
	};
	dodopayments: {
		dodoPaymentsApiKey: string | undefined;
		dodoTestApiKey: string | undefined;
		dodoWebhookKey: string | undefined;
		dodoSubscriptionProductId: string | undefined;
	};
}

interface VisitAggregateResult {
	_id: {
		year: number;
		month: number;
		day: number;
	};
	count: number;
}

interface WebhookPayload {
	data: {
		payment_id: string;
		[key: string]: any; // allow extra properties
	};
	[key: string]: any; // allow other top-level fields like `type`, `data`, etc.
}
