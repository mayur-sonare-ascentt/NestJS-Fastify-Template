import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyRawBody, { RawBodyPluginOptions } from 'fastify-raw-body';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import swagger from '@fastify/swagger';
// import swaggerUi from '@fastify/swagger-ui';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	//Swagger setup
	const config = new DocumentBuilder()
		.setTitle('FirstOx Studio backend')
		.setDescription('FirstOx Studio backend API Docs')
		.setVersion('1.0')
		.addTag('firstox-studio')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, documentFactory);

	await app.register(fastifyRawBody, {
		field: 'rawBody',
		global: false,
		encoding: 'utf8',
		runFirst: true,
	} as RawBodyPluginOptions);

	await app.register(fastifyCookie);

	await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch((err) => {
	console.error('Error during bootstrap:', err);
	process.exit(1);
});
