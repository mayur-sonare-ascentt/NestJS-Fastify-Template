import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/user.schema';
import { TempOrder, TempOrderDocument } from '@/schemas/tempOrder.schema';
import { Affiliate, AffiliateDocument } from '@/schemas/affiliate.schema';
import { ENVService } from '@/modules/core/services/env.service';
import { Webhook } from 'standardwebhooks';

@Injectable()
export class WebhookService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(TempOrder.name) private tempOrderModel: Model<TempOrderDocument>,
		@InjectModel(Affiliate.name) private affiliateModel: Model<AffiliateDocument>,
		private readonly envService: ENVService,
	) {}

	async captureOrder(req: FastifyRequest, res: FastifyReply): Promise<void> {
		try {
			const webhookKey = this.envService.variables.dodopayments.dodoWebhookKey;
			if (!webhookKey) {
				throw new InternalServerErrorException('DODO_WEBHOOK_KEY is not set in environment variables');
			}
			const webhook = new Webhook(webhookKey);

			const rawBody = req.rawBody?.toString('utf8');

			if (!rawBody) throw new BadRequestException('Missing raw body');

			const headers = req.headers;

			const webhookHeaders = {
				'webhook-id': Array.isArray(headers['webhook-id']) ? headers['webhook-id'][0] : headers['webhook-id'] || '',
				'webhook-signature': Array.isArray(headers['webhook-signature'])
					? headers['webhook-signature'][0]
					: headers['webhook-signature'] || '',
				'webhook-timestamp': Array.isArray(headers['webhook-timestamp'])
					? headers['webhook-timestamp'][0]
					: headers['webhook-timestamp'] || '',
			};

			// ✅ Verify signature

			await webhook.verify(rawBody, webhookHeaders);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const payload = JSON.parse(rawBody);
			console.log('Received webhook payload:', payload);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			switch (payload.type) {
				case 'payment.succeeded':
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					await this.handlePaymentSucceeded(payload);
					res.status(200).send({ message: 'Success' });
					return;
				case 'payment.failed':
					res.status(200).send({ message: 'Payment failed event received' });
					return;
				default:
					res.status(501).send({ error: 'Unhandled event type' });
					return;
			}
		} catch (error) {
			console.error('❌ Error verifying or handling webhook:', error);
			res.status(400).send({ error: 'Webhook verification or processing failed' });
		}
	}

	private async handlePaymentSucceeded(payload: WebhookPayload): Promise<void> {
		const { payment_id } = payload.data;
		if (!payment_id) throw new BadRequestException('Missing payment_id in payload');

		const tempOrder = await this.tempOrderModel.findOne({
			paymentId: payment_id,
		});
		if (!tempOrder) return;

		const user = await this.userModel.findOne({ email: tempOrder.email });
		if (user) {
			user.plan = 'premium'; // adjust this field based on your schema
			await user.save();
		}

		if (tempOrder.affiliate) {
			const affiliateUser = await this.affiliateModel.findOne({
				username: tempOrder.affiliate,
			});
			if (affiliateUser) {
				affiliateUser.success_refers += 1;
				await affiliateUser.save();
			}
		}

		await tempOrder.deleteOne();
		console.log('✅ Payment succeeded and processed for:', tempOrder.email);
	}
}
