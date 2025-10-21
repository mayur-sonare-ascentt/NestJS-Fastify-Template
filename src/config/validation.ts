import * as Joi from 'joi';

const validationSchema = Joi.object({
	// App
	APP_NAME: Joi.string().default('nestjs-fastify-app'),
	NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
	PORT: Joi.number().default(3000),

	// Database
	// DB_HOST: Joi.string().default('localhost'),
	// DB_PORT: Joi.number().default(5432),
	// DB_NAME: Joi.string().default('app_db'),
	// DB_USER: Joi.string().default('postgres'),
	// DB_PASSWORD: Joi.string().default('postgres'),
	MONGODB_URI: Joi.string().uri().required(),

	// JWT
	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().default('1d'),

	// Storage
	STORAGE_PROVIDER: Joi.string().valid('local', 's3').default('local'),
	STORAGE_BUCKET: Joi.string().default('app-bucket'),
	STORAGE_REGION: Joi.string().default('us-east-1'),

	// Logging
	LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
});

export default validationSchema;
