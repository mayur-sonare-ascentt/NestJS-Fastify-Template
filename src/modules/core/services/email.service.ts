import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { ENVService } from '@/modules/core/services/env.service';

@Injectable()
export class EmailService {
	private transporter: Transporter;

	constructor(private readonly envService: ENVService) {
		this.transporter = createTransport({
			host: this.envService.variables.email.host,
			port: this.envService.variables.email.port || 465,
			secure: this.envService.variables.email.secure,
			auth: {
				user: this.envService.variables.email.user,
				pass: this.envService.variables.email.pass,
			},
		});
	}

	async sendMail(mailOptions: SendMailOptions): Promise<void> {
		try {
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			console.error('Error sending email:', error);
			throw new InternalServerErrorException('Failed to send email');
		}
	}
}
