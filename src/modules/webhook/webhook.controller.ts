import { Controller, Post, Req, Res } from '@nestjs/common';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { ApiTags } from '@nestjs/swagger';
import { WebhookService } from '@/modules/webhook/webhook.service';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}

	@Post('capture-order')
	captureOrder(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
		return this.webhookService.captureOrder(req, res);
	}
}
