import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninBodyAuthDto {
	@ApiProperty({
		example: '<email@example.com>',
		description: 'Email of the user',
	})
	@IsEmail()
	email!: string;

	@ApiProperty({ example: 'password123', description: 'Password for the user' })
	@IsNotEmpty()
	password!: string;
}

export class SigninResponseAuthDto {
	message!: string;
	token!: string;
}
