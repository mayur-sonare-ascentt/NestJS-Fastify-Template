import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from '@/schemas';
import { WebhookController } from '@/modules/webhook/webhook.controller';
import { WebhookService } from '@/modules/webhook/webhook.service';

@Module({
	imports: [MongooseModule.forFeature([...MongooseModels])],
	controllers: [WebhookController],
	providers: [WebhookService],
})
export class WebhookModule {}
