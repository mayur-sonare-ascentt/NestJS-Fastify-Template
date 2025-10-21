import { Injectable } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { ENVService } from '@/modules/core/services/env.service';

@Injectable()
export class UtilsService {
	constructor(private readonly envService: ENVService) {}

	async getEmail(token: string): Promise<string | null> {
		const JWT_SECRET_KEY = new TextEncoder().encode(this.envService.variables.jwt.secret);

		try {
			const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
				algorithms: ['HS256'],
			});

			if (typeof payload.email === 'string') {
				return payload.email;
			}

			return null;
		} catch (err) {
			console.error('Invalid or expired token:', err);
			return null;
		}
	}
}
