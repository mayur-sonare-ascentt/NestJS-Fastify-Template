import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@/modules/core/core.module';
import { UsersModule } from '@/modules/users/users.module';
import configuration from '@/config/configuration';
import validationSchema from '@/config/validation';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/modules/auth/auth.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { AffiliateModule } from '@/modules/affiliate/affiliate.module';
import { ENVService } from '@/modules/core/services/env.service';
import { WebhookModule } from '@/modules/webhook/webhook.module';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [envFile, '.env'], // fallback to base .env
			load: [configuration],
			isGlobal: true, // makes ConfigService available in all modules
			validationSchema,
		}),
		MongooseModule.forRootAsync({
			inject: [ENVService],
			useFactory: (envService: ENVService) => ({
				uri: envService.variables.database.mongoUri,
			}),
		}),
		CoreModule,
		UsersModule,
		AuthModule,
		AdminModule,
		AffiliateModule,
		WebhookModule,
	],
})
export class AppModule {}
