import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
	constructor() {}

	getHello(): string {
		return 'Hello World!';
	}

	getHealth(): string {
		return 'OK';
	}
}
