export default (): Configuration => ({
	app: {
		name: process.env.APP_NAME || 'nestjs-fastify-app',
		nodeEnv: process.env.NODE_ENV || 'development',
		port: parseInt(process.env.PORT ?? '3000', 10),
	},
	frontend: {
		appUrl: process.env.APP_URL || 'http://localhost:3000/',
	},
	database: {
		// host: process.env.DB_HOST || 'localhost',
		// port: parseInt(process.env.DB_PORT ?? '5432', 10),
		// name: process.env.DB_NAME || 'app_db',
		// user: process.env.DB_USER || 'postgres',
		// password: process.env.DB_PASSWORD || 'postgres',
		mongoUri: process.env.MONGODB_URI,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN || '1d',
	},
	email: {
		host: process.env.EMAIL_HOST,
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
		receiver: process.env.EMAIL_RECEIVER,
		port: parseInt(process.env.EMAIL_PORT ?? '465'),
		secure: process.env.EMAIL_SECURE === 'true' ? true : false,
	},
	storage: {
		provider: process.env.STORAGE_PROVIDER,
		bucket: process.env.STORAGE_BUCKET,
		region: process.env.STORAGE_REGION,
	},
	logging: {
		level: process.env.LOG_LEVEL || 'info',
	},
	dodopayments: {
		dodoPaymentsApiKey: process.env.DODO_PAYMENTS_API_KEY,
		dodoTestApiKey: process.env.DODO_TEST_API_KEY,
		dodoWebhookKey: process.env.DODO_WEBHOOK_KEY,
		dodoSubscriptionProductId: process.env.DODO_SUBSCRIPTION_PRODUCT_ID,
	},
});
